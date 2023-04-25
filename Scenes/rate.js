import { Scenes } from "telegraf";
import messages from "../messages.js";
import User from "../model/User.js";

export const setRate = () => {
  const scene = new Scenes.BaseScene("setRate");

  scene.enter((ctx) => {
    ctx.reply(messages().rateEnter);
  });

  scene.on("text", async (ctx) => {
    try {
      const userId = ctx.message.from.id;
      let userRate = Number(ctx.message.text);

      if (isNaN(userRate)) {
        await ctx.reply(messages().rateNaNError);
        return ctx.scene.reenter();
      }

      const user = await User.findOne({ userId });
      if (!user) {
        new User({ userId, rate: userRate }).save();
      }

      if (typeof userRate === "number") {
        await ctx.reply(messages(userRate).reateThx);
        await ctx.scene.leave();
      }
    } catch (err) {
      if (err) ctx.reply(messages().error);
      console.log(err);
    }
  });
  return scene;
};

export const changeRate = () => {
  const scene = new Scenes.BaseScene("changeRate");
  scene.enter((ctx) => {
    ctx.reply(messages().changeRate);
  });
  scene.on("text", async (ctx) => {
    try {
      const userId = ctx.message.from.id;
      let newUserRate = Number(ctx.message.text);

      if (isNaN(newUserRate)) {
        await ctx.reply(messages().rateNaNError);
        return ctx.scene.reenter();
      }

      const user = await User.findOne({ userId });
      await user.updateOne({ $set: { rate: newUserRate } });

      if (typeof newUserRate === "number") {
        await ctx.reply(messages(newUserRate).reateThx);
        await ctx.scene.leave();
      }
    } catch (err) {
      if (err) ctx.reply(messages().error);
      console.log(err);
    }
  });

  return scene;
};
