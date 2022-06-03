### Introduction

Lightweight and simple library that helps manage callback data 
when using inline buttons in messages

### Installation

```
$ npm install @bot-base/callback-data
```
or using `yarn`:
```
$ yarn add @bot-base/callback-data
```

### Example

```ts
import { Telegraf, Markup, Context } from 'telegraf';
import { CallbackData } from '@bot-base/callback-data';

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
```

There's some more complex [examples](examples/): [counter](examples/counter-bot.ts) and [menu](examples/menu-bot.ts).

### API Usage Example

```js
exampleCallbackData = new CallbackData(
  'namespace-prefix',
  ['id', 'action' /* many as you want */]
  /* separator = ':' */
);

const callbackData = exampleCallbackData.create({
  id: '1337',
  action: 'show',
});
console.log(callbackData); // namespace-prefix:1337:show

const parsedCallbackData = exampleCallbackData.parse(callbackData);
console.log(parsedCallbackData); // { id: "1337", action: "show" }

const regexpCallbackDataFilter = exampleCallbackData.filter({
  action: 'show',
});
console.log(regexpCallbackDataFilter); // /namespace-prefix:.*:show/
```
