const { Telegraf, Markup } = require('telegraf');
const { CallbackData } = require('callback-data');

const bot = new Telegraf(process.env.BOT_TOKEN);

const drinksData = new CallbackData('drinks', ['id', 'action']);

bot.start((ctx) =>
  ctx.reply('Welcome', {
    ...Markup.inlineKeyboard([
      Markup.button.callback(
        'Order Coke',
        drinksData.create({
          id: 1,
          action: 'order'
        })
      ), // button callback data is equal to `drinks:1:order`

      Markup.button.callback(
        'Order Juice',
        drinksData.create({
          id: 2,
          action: 'order'
        })
      ) // button callback data is equal to `drinks:2:order`
    ])
  })
);

bot.action(
  drinksData.filter({
    action: 'order'
  }),
  async (ctx) => {
    const { id, action } = drinksData.parse(ctx.callbackQuery.data);

    await ctx.answerCbQuery(`You ordered #${id}`, {
      show_alert: true
    });
  }
);

bot.launch();
