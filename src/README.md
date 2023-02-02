## Introduction

Lightweight and simple library that helps manage callback data
when using inline keyboards.

## Installation

### Node

```
$ npm install callback-data
```

or using `yarn`:

```
$ yarn add callback-data
```

### Deno

```ts
import { createCallbackData } from "https://deno.land/x/callback_data/mod.ts";
```

## Example

```ts
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
```

There's more complex example [counter-bot](https://github.com/deptyped/callback-data/blob/main/examples/counter-bot.ts).

## Usage

### Create callback data

```ts
const callbackData = createCallbackData(
  // unique prefix for callback data
  "data",
  // callback data fields
  {
    id: Number,
    name: String,
    isAdmin: Boolean,
    // only Number, String, Boolean data types are supported
  },
);
```

### Pack callback data

```ts
const packedData = callbackData.pack({
  id: 1337,
  name: "John",
  isAdmin: true,
});

console.log(packedData); // data:1337:John:1
```

### Unpack callback data

```ts
const unpackedData = callbackData.unpack(packedData);

console.log(unpackedData);
// {
//   id: 1337,
//   name: "John",
//   isAdmin: true,
// }
```

### Filter by callback data

```ts
const regex = callbackData.filter({
  id: 1337,
});

console.log(regex); // /^data:1337:\w+:\d$/
```
