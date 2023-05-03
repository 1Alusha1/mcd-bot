import { Telegraf, Scenes, session, Markup } from "telegraf";
import "dotenv/config";
import db from "./db.js";
import messages from "./messages.js";
import { changeRate, setRate } from "./Scenes/rate.js";
import { askTotalHours, setWeekSalary } from "./Scenes/salary.js";
import { showResult } from "./Scenes/result.js";

const stage = new Scenes.Stage([
  setRate(),
  changeRate(),
  setWeekSalary(),
  askTotalHours(),
  showResult(),
]);
const bot = new Telegraf(process.env.TOKEN);

db().catch((err) => console.log(err));

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.replyWithHTML(
    messages().start,
    Markup.keyboard(["Изменить ставку", "указать неделю", "Посмотреть цифры"])
      .oneTime()
      .resize()
  );
  await ctx.scene.enter("setRate");
});

bot.hears("Изменить ставку", (ctx) => ctx.scene.enter("changeRate"));
bot.hears("указать неделю", (ctx) => ctx.scene.enter("setWeekSalary"));
bot.hears("Посмотреть цифры", (ctx) => ctx.scene.enter("showResult"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
