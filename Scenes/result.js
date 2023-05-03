import { Markup, Scenes } from "telegraf";
import messages from "../messages.js";
import Record from "../model/Record.js";
import state, { monthsRevers } from "../state.js";
import actionButton from "../use/actionButton.js";
import { formatData } from "../use/formatData.js";
import { formatDate } from "../use/formatDate.js";

export const showResult = () => {
  const scene = new Scenes.BaseScene("showResult");

  scene.enter(async (ctx) => {
    const userId = ctx.message.from.id;
    try {
      const records = await Record.find({ userId });
      const data = formatData(records);

      let btns = [];
      data.forEach((m) => {
        btns.push([Markup.button.callback(`${m.month}`, `${m.month}`)]);
      });
      ctx.reply("Месяц:", Markup.inlineKeyboard([...btns]));

      actionButton(data, scene, async (ctx, item) => {
        let sum = 0;
        const userRecord = await Record.find({ userId, month: item.month });
        userRecord.forEach((item) => (sum += item.salary));
        await ctx.reply(`Сумма за месяц: ${sum} грн`);
        userRecord.forEach((i) => {
          sum += i.salary;
          ctx.replyWithHTML(
            messages(
              formatDate(i.startWeek),
              formatDate(monthsRevers[i.month]),
              i.year,
              i.totalHour,
              i.salary
            ).weekSalaryReport
          );
        });
        ctx.scene.leave();
      });
    } catch (err) {
      if (err) ctx.reply(messages().error);
      console.log(err);
    }
  });

  return scene;
};
