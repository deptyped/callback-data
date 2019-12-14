const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const { CallbackData } = require('telegraf-callback-data');
const bot = new Telegraf(process.env.BOT_TOKEN);

drinksCallbackData = new CallbackData('drinks', ['id', 'action']);

bot.start(ctx => {
  ctx.reply('Welcome', {
    ...Markup.inlineKeyboard([
      Markup.callbackButton(
        'Order Coke',
        drinksCallbackData.new({
          id: 1,
          action: 'order',
        })
      ), // button callback data is equal to `drinks:1:order`

      Markup.callbackButton(
        'Order Juice',
        drinksCallbackData.new({
          id: 2,
          action: 'order',
        })
      ), // button callback data is equal to `drinks:2:order`
    ]).extra(),
  });
});

bot.action(
  drinksCallbackData.filter({
    action: 'order',
  }),
  async ({ callbackQuery, answerCbQuery }) => {
    const { id, action } = drinksCallbackData.parse(callbackQuery.data);

    await answerCbQuery(`You ordered #${id}`);
  }
);

bot.catch(console.error).launch();
