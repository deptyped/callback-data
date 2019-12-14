const { CallbackData } = require('../src');
const { CallbackDataOverflowError, CallbackDataParseError } = require('../src');

describe('serialization', () => {
  test('should create callback data without prefix', () => {
    const testCallbackData = new CallbackData('', ['id', 'action']);

    expect(
      testCallbackData.new({
        id: 1,
        action: 'test',
      })
    ).toBe('1:test');
  });

  test('should create callback data with prefix', () => {
    const prefix = 'some-text-prefix';
    const testCallbackData = new CallbackData(prefix, ['id', 'action']);

    expect(
      testCallbackData.new({
        id: 1,
        action: 'test',
      })
    ).toBe(`${prefix}:1:test`);
  });

  test('should throw CallbackDataOverflowError error when callback data reach overflow', () => {
    const testDataObj = {};

    for (var i of [...Array(30).keys()]) {
      testDataObj[`d${i}`] = i.toString();
    }

    const testCallbackData = new CallbackData(
      'prefix',
      Object.keys(testDataObj)
    );

    expect(() => {
      testCallbackData.new(testDataObj);
    }).toThrow(CallbackDataOverflowError);
  });
});

describe('deserialization', () => {
  test('should parse callback data string', () => {
    const testDataObj = {};

    for (var i of [...Array(10).keys()]) {
      testDataObj[`d${i}`] = i.toString();
    }

    const testCallbackData = new CallbackData(
      'prefix',
      Object.keys(testDataObj)
    );
    const testDataString = testCallbackData.new(testDataObj);

    expect(testCallbackData.parse(testDataString)).toStrictEqual(testDataObj);
  });

  test('should throw CallbackDataParseError error when prefix missmatch', () => {
    const testCallbackDataWithPrefix = new CallbackData('prefix', [
      'id',
      'action',
    ]);
    const testCallbackDataWithoutPrefix = new CallbackData('', [
      'id',
      'action',
    ]);

    expect(() => {
      testCallbackDataWithPrefix.parse(
        testCallbackDataWithoutPrefix.new({
          id: 1,
          action: 'test',
        })
      );
    }).toThrow(CallbackDataParseError);

    expect(() => {
      testCallbackDataWithoutPrefix.parse(
        testCallbackDataWithPrefix.new({
          id: 1,
          action: 'test',
        })
      );
    }).toThrow(CallbackDataParseError);
  });
});

test('should create filter regexp', () => {
  const testCallbackData = new CallbackData('prefix', ['id', 'action']);

  expect(
    testCallbackData.filter({
      action: 'test',
    })
  ).toStrictEqual(/prefix:\w+:test/);

  expect(
    testCallbackData.filter({
      id: 1,
      action: 'test',
    })
  ).toStrictEqual(/prefix:1:test/);
});
