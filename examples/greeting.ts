import { Telegraf, Markup, Context } from 'telegraf';
import { CallbackData } from 'telegraf-callback-data';

const bot = new Telegraf(process.env.BOT_TOKEN);

const greetingData = new CallbackData<{ type: string; }>(
  'greeting', // namespace identifier
  ['type'] // data properties
);

bot.start((ctx: Context) =>
  ctx.reply('How to greet?', {
    ...Markup.inlineKeyboard([
      Markup.button.callback(
        'oldschool',
        greetingData.create({
          type: 'oldschool',
        })
      ), // callback data is equal to `greeting:oldschool`

      Markup.button.callback(
        'modern',
        greetingData.create({
          type: 'modern',
        })
      ), // callback data is equal to `greeting:modern`
    ]),
  })
);

bot.action(
  greetingData.filter({
    type: 'modern',
  }),
  (ctx) => ctx.answerCbQuery('Yo')
);

bot.action(
  greetingData.filter({
    type: 'oldschool',
  }),
  (ctx) => ctx.answerCbQuery('Hello')
);

bot.launch();