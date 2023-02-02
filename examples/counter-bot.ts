import { Bot, InlineKeyboard } from "grammy";
import { createCallbackData } from "callback-data";

const bot = new Bot(process.env.BOT_TOKEN);

let counter = 0;

const resetCounterData = createCallbackData("reset", {});
const counterData = createCallbackData("counter", {
  action: String,
  number: Number,
});

const counterKeyboard = new InlineKeyboard()
  .text(
    "+1",
    counterData.pack({
      number: 1,
      action: "plus",
    }), // callback data is equal to "counter:1:plus"
  )
  .text(
    "+5",
    counterData.pack({
      number: 5,
      action: "plus",
    }), // callback data is equal to "counter:5:plus"
  )
  .row()
  .text(
    "-1",
    counterData.pack({
      number: 1,
      action: "minus",
    }), // callback data is equal to "counter:1:minus"
  )
  .text(
    "-5",
    counterData.pack({
      number: 5,
      action: "minus",
    }), // callback data is equal to "counter:5:minus"
  )
  .row()
  .text(
    "Reset",
    resetCounterData.pack({}), // callback data is equal to "reset"
  );

bot.command("start", (ctx) =>
  ctx.reply(`Hi! Counter: ${counter}`, {
    reply_markup: counterKeyboard,
  }));

bot.callbackQuery(
  counterData.filter(),
  async (ctx) => {
    const { number, action } = counterData.unpack(
      ctx.callbackQuery.data,
    );

    if (action === "plus") {
      counter += Number(number);
    } else if (action === "minus") {
      counter -= Number(number);
    }

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Counter: ${counter}`, {
      reply_markup: counterKeyboard,
    });
  },
);

bot.callbackQuery(
  resetCounterData.filter(),
  async (ctx) => {
    counter = 0;

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(`Counter: ${counter}`, {
      reply_markup: counterKeyboard,
    });
  },
);

bot.start();
