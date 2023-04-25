import { Telegraf } from "telegraf";
import "dotenv/config";
import db from "./db";

const bot = new Telegraf(process.env.TOKEN);

db().catch((err) => console.log(err));
bot.start((ctx) => ctx.reply("hello"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
