import {
  assertEquals,
  assertMatch,
  assertThrows,
} from "https://deno.land/std@0.174.0/testing/asserts.ts";
import { createCallbackData } from "../src/callback-data.ts";
import { BOOLEAN_REGEX, NUMBER_REGEX, STRING_REGEX } from "../src/regex.ts";

Deno.test("create callback data with identifier", () => {
  const callbackData = createCallbackData("test", {});

  assertEquals(callbackData.pack({}), "test");
});

Deno.test("create callback data with identifier and data", () => {
  const callbackData = createCallbackData("test", {
    data1: Number,
    data2: String,
    data3: Boolean,
  });

  assertEquals(
    callbackData.pack({
      data3: true,
      data2: "Some text",
      data1: 1337,
    }),
    "test:1337:Some text:1",
  );
  assertEquals(
    callbackData.pack({
      data2: "Some text",
      data3: true,
      data1: 1337,
    }),
    "test:1337:Some text:1",
  );
});

Deno.test("throw error when callback data reach overflow", () => {
  const callbackData = createCallbackData("test", {
    data: String,
  });

  assertThrows(() => {
    callbackData.pack({
      data: "text".repeat(20),
    });
  });
});

Deno.test("throw error when using delimiter in callback data values", () => {
  const callbackData = createCallbackData("test", {
    data: String,
  });

  assertThrows(() => {
    callbackData.pack({
      data: "te:xt",
    });
  });
});

Deno.test("parse callback data string", () => {
  const callbackData = createCallbackData("test", {
    data1: Number,
    data2: String,
    data3: Boolean,
  });

  assertEquals(callbackData.unpack("test:1337:Some text:1"), {
    data2: "Some text",
    data3: true,
    data1: 1337,
  });
});

Deno.test("throw error when callback data ID mismatch", () => {
  const callbackData = createCallbackData("test", {});

  assertThrows(() => {
    callbackData.unpack("test1");
  });
});

Deno.test("create callback data filter", () => {
  const callbackData = createCallbackData("test", {
    data1: Number,
    data2: String,
    data3: Boolean,
  });

  assertEquals(
    callbackData.filter({
      data1: 1337,
    }),
    new RegExp(`^test:1337:${STRING_REGEX.source}:${BOOLEAN_REGEX.source}$`),
  );

  assertEquals(
    callbackData.filter({
      data2: "text",
    }),
    new RegExp(`^test:${NUMBER_REGEX.source}:text:${BOOLEAN_REGEX.source}$`),
  );

  assertEquals(
    callbackData.filter({
      data2: "тест",
    }),
    new RegExp(`^test:${NUMBER_REGEX.source}:тест:${BOOLEAN_REGEX.source}$`),
  );

  assertEquals(
    callbackData.filter({
      data3: true,
    }),
    new RegExp(`^test:${NUMBER_REGEX.source}:${STRING_REGEX.source}:1$`),
  );
});

Deno.test("match callback data filter", () => {
  const callbackData = createCallbackData("test", {
    data1: Number,
    data2: String,
    data3: Boolean,
  });

  assertMatch(
    "test:1337:test:1",
    callbackData.filter({
      data1: 1337,
    }),
  );
  assertMatch(
    "test:1337:тест:1",
    callbackData.filter({
      data1: 1337,
    }),
  );

  assertMatch(
    "test:1337:тест:1",
    callbackData.filter({
      data2: "тест",
    }),
  );
});
