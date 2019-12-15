### Introduction

Lightweight and simple library that helps manage callback data 
when using inline buttons in messages

### Installation

```
$ npm install telegraf-callback-data
```
or using `yarn`:
```
$ yarn add telegraf-callback-data
```

### Example
  
```js
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const { CallbackData } = require('telegraf-callback-data');

const bot = new Telegraf(process.env.BOT_TOKEN);

greetingCD = new CallbackData('greeting', ['type']);

bot.start(({ reply }) =>
  reply('How to greet?', {
    ...Markup.inlineKeyboard([
      Markup.callbackButton(
        'oldschool',
        greetingCD.new({
          type: 'oldschool',
        })
      ), // callback data is equal to `greeting:oldschool`

      Markup.callbackButton(
        'modern',
        greetingCD.new({
          type: 'modern',
        })
      ), // callback data is equal to `greeting:modern`
    ]).extra(),
  })
);

bot.action(
  greetingCD.filter({
    type: 'oldschool',
  }),
  ({ answerCbQuery }) => answerCbQuery('Hello')
);

bot.action(
  greetingCD.filter({
    type: 'modern',
  }),
  ({ answerCbQuery }) => answerCbQuery('Yo')
);

bot.launch();
```

There's some more complex [examples](examples/): [counter](examples/counter-bot.js) and [menu](examples/menu-bot.js).

### API Usage Example

```js
exampleCallbackData = new CallbackData(
  'namespace-prefix',
  ['id', 'action' /* many as you want */]
  /* separator = ':' */
);

const callbackData = exampleCallbackData.new({
  id: '1337',
  action: 'show',
});
console.log(callbackData); // namespace-prefix:1337:show

const parsedCallbackData = exampleCallbackData.parse(callbackData);
console.log(parsedCallbackData); // { id: "1337", action: "show" }

const regexpCallbackDataFilter = exampleCallbackData.filter({
  action: 'show',
});
console.log(regexpCallbackDataFilter); // /namespace-prefix:\w+:show/
```

### Credits
Thanks to [@JrooTJunior](https://github.com/JrooTJunior), author of [AIOGram](https://github.com/aiogram/aiogram)! This library highly inspired by alternative feature in aiogram framework.
