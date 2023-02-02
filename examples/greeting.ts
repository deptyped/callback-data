import { Bot, InlineKeyboard } from "grammy";
import { createCallbackData } from "callback-data";

const bot = new Bot(process.env.BOT_TOKEN);

const greetingData = createCallbackData("greeting", {
  type: String,
});

const greetingKeyboard = new InlineKeyboard()
  .text(
    "oldschool",
    greetingData.pack({
      type: "oldschool",
    }), // callback data is equal to "greeting:oldschool"
  )
  .text(
    "modern",
    greetingData.pack({
      type: "modern",
    }), // callback data is equal to "greeting:modern"
  );

bot.command("start", (ctx) =>
  ctx.reply("How to greet?", {
    reply_markup: greetingKeyboard,
  }));

bot.callbackQuery(
  greetingData.filter({
    type: "oldschool",
  }),
  (ctx) => ctx.answerCallbackQuery("Hello"),
);

bot.callbackQuery(
  greetingData.filter({
    type: "modern",
  }),
  (ctx) => ctx.answerCallbackQuery("Yo"),
);

bot.start();
