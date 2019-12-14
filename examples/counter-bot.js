const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const { CallbackData } = require('telegraf-callback-data');

const bot = new Telegraf(process.env.BOT_TOKEN);

let counter = 0;

counterResetCallbackData = new CallbackData('counter', ['action']);
counterCallbackData = new CallbackData('counter', ['number', 'action']);

const inlineKeyboard = [
  [
    Markup.callbackButton(
      '+1',
      counterCallbackData.new({
        number: 1,
        action: 'plus',
      })
    ), // button callback data is equal to `counter:1:plus`

    Markup.callbackButton(
      '+5',
      counterCallbackData.new({
        number: 5,
        action: 'plus',
      })
    ), // button callback data is equal to `counter:5:plus`

    Markup.callbackButton(
      '+15',
      counterCallbackData.new({
        number: 15,
        action: 'plus',
      })
    ), // button callback data is equal to `counter:15:plus`
  ],
  [
    Markup.callbackButton(
      '-1',
      counterCallbackData.new({
        number: 1,
        action: 'minus',
      })
    ), // button callback data is equal to `counter:1:minus`

    Markup.callbackButton(
      '-5',
      counterCallbackData.new({
        number: 5,
        action: 'minus',
      })
    ), // button callback data is equal to `counter:5:minus`

    Markup.callbackButton(
      '-15',
      counterCallbackData.new({
        number: 15,
        action: 'minus',
      })
    ), // button callback data is equal to `counter:15:minus`
  ],
  [
    Markup.callbackButton(
      'Reset',
      counterResetCallbackData.new({
        action: 'reset',
      })
    ), // button callback data is equal to `counter:reset`
  ],
];

bot.start(({ reply }) =>
  reply(`Hi! Counter: ${counter}`, {
    ...Markup.inlineKeyboard(inlineKeyboard).extra(),
  })
);

bot.action(
  counterCallbackData.filter({
    action: 'minus',
  }),
  async ({ callbackQuery, answerCbQuery, editMessageText }) => {
    const { number, action } = counterCallbackData.parse(callbackQuery.data);

    counter -= Number(number);

    await answerCbQuery();
    await editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard).extra(),
    });
  }
);

bot.action(
  counterCallbackData.filter({
    action: 'plus',
  }),
  async ({ callbackQuery, answerCbQuery, editMessageText }) => {
    const { number, action } = counterCallbackData.parse(callbackQuery.data);

    counter += Number(number);

    await answerCbQuery();
    await editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard).extra(),
    });
  }
);

bot.action(
  counterResetCallbackData.filter({
    action: 'reset',
  }),
  async ({ answerCbQuery, editMessageText }) => {
    counter = 0;

    await answerCbQuery();
    await editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard).extra(),
    });
  }
);

bot.catch(console.error).launch();
