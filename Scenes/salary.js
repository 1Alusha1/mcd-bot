import { Scenes } from "telegraf";
import messages from "../messages.js";
import Record from "../model/Record.js";
import User from "../model/User.js";
import state, { months } from "../state.js";
import { formatDate } from "../use/formatDate.js";

export const setWeekSalary = () => {
  const scene = new Scenes.BaseScene("setWeekSalary");

  scene.enter((ctx) => {
    ctx.reply(messages().weekStart);
  });

  scene.on("text", async (ctx) => {
    let startWeek = Number(ctx.message.text);

    if (isNaN(startWeek)) {
      await ctx.reply(messages().startWeekError);
      return ctx.scene.reenter();
    }

    if (startWeek > 31 || startWeek < 1) {
      await ctx.reply(messages().startWeekSecondeError);
      return ctx.scene.reenter();
    }

    state.startWeek = startWeek;
    ctx.scene.enter("askTotalHours");
  });
  return scene;
};

export const askTotalHours = () => {
  const scene = new Scenes.BaseScene("askTotalHours");

  scene.enter((ctx) => ctx.reply(messages().totalHour));

  scene.on("text", async (ctx) => {
    const userId = ctx.message.from.id;
    let totalHour = Number(ctx.message.text);

    const date = new Date();
    const month = date.getMonth();

    if (isNaN(totalHour)) {
      await ctx.reply(messages().startWeekError);
      return ctx.scene.reenter();
    }

    const user = await User.findOne({ userId });
    const dto = {
      year: date.getFullYear(),
      month: months[month],
      startWeek: state.startWeek,
      totalHour,
      salary: totalHour * user.rate,
      userId,
    };
    const record = new Record(dto);
    record.save();
    await user.updateOne({ $push: { salaryList: record._id } });

    await ctx.replyWithHTML(
      messages(
        formatDate(dto.startWeek),
        formatDate(month),
        dto.year,
        dto.totalHour,
        dto.salary
      ).weekSalaryReport
    );
    await ctx.scene.leave();
  });
  return scene;
};
