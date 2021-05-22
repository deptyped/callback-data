import { Context, deunionize, Markup, Telegraf } from 'telegraf';
import { CallbackData } from 'telegraf-callback-data';

const bot = new Telegraf(process.env.BOT_TOKEN);

const drinksData = new CallbackData<{
  id: string;
  action: string;
}>('drinks', ['id', 'action']);

bot.start((ctx: Context) =>
  ctx.reply('Welcome', {
    ...Markup.inlineKeyboard([
      Markup.button.callback(
        'Order Coke',
        drinksData.create({
          id: String(1),
          action: 'order'
        })
      ), // button callback data is equal to `drinks:1:order`

      Markup.button.callback(
        'Order Juice',
        drinksData.create({
          id: String(2),
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
  async (ctx: Context) => {
    const { id, action } = drinksData.parse(deunionize(ctx.callbackQuery).data);

    await ctx.answerCbQuery(`You ordered #${id}`, {
      show_alert: true
    });
  }
);

bot.launch();
