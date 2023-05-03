export default function (actionName, bot, cb) {
  if (typeof actionName === "string") {
    bot.action(actionName, async (ctx) => cb(ctx));
  } else {
    actionName.forEach((item) => {
      bot.action(item.month, async (ctx) => cb(ctx, item));
    });
  }
}
