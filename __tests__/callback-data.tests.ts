import {
  CallbackData,
  CallbackDataOverflowError,
  CallbackDataParseError
} from '../src';

describe('serialization', () => {
  test('should create callback data without identifier', () => {
    const testCallbackData = new CallbackData('', ['id', 'action']);

    expect(
      testCallbackData.create({
        id: String(1),
        action: 'test'
      })
    ).toBe('1:test');
  });

  test('should create callback data with identifier', () => {
    const identifier = 'some-text-identifier';
    const testCallbackData = new CallbackData(identifier, ['id', 'action']);

    expect(
      testCallbackData.create({
        id: String(1),
        action: 'test'
      })
    ).toBe(`${identifier}:1:test`);

    // TODO: Remove in 1.0
    expect(
      testCallbackData.new({
        id: String(1),
        action: 'test'
      })
    ).toBe(`${identifier}:1:test`);
  });

  test('should throw CallbackDataOverflowError error when callback data reach overflow', () => {
    const testDataObj = {};

    for (const i of [...Array(30).keys()]) {
      testDataObj[`d${i}`] = i.toString();
    }

    const testCallbackData = new CallbackData(
      'identifier',
      Object.keys(testDataObj)
    );

    expect(() => {
      testCallbackData.create(testDataObj);
    }).toThrow(CallbackDataOverflowError);
  });
});

describe('deserialization', () => {
  test('should parse callback data string', () => {
    const testDataObj = {};

    for (const i of [...Array(10).keys()]) {
      testDataObj[`d${i}`] = i.toString();
    }

    const testCallbackData = new CallbackData(
      'identifier',
      Object.keys(testDataObj)
    );
    const testDataString = testCallbackData.create(testDataObj);

    expect(testCallbackData.parse(testDataString)).toStrictEqual(testDataObj);
  });

  test('should throw CallbackDataParseError error when identifier missmatch', () => {
    const testCallbackDataWithIdentifier = new CallbackData('identifier', [
      'id',
      'action'
    ]);
    const testCallbackDataWithoutIdentifier = new CallbackData('', [
      'id',
      'action'
    ]);

    expect(() => {
      testCallbackDataWithIdentifier.parse(
        testCallbackDataWithoutIdentifier.create({
          id: String(1),
          action: 'test'
        })
      );
    }).toThrow(CallbackDataParseError);

    expect(() => {
      testCallbackDataWithoutIdentifier.parse(
        testCallbackDataWithIdentifier.create({
          id: String(1),
          action: 'test'
        })
      );
    }).toThrow(CallbackDataParseError);
  });
});

test('should create filter regexp', () => {
  const testCallbackData = new CallbackData('identifier', ['id', 'action']);

  expect(
    testCallbackData.filter({
      action: 'test'
    })
  ).toStrictEqual(/identifier:\w+:test/);

  expect(
    testCallbackData.filter({
      id: String(1),
      action: 'test'
    })
  ).toStrictEqual(/identifier:1:test/);

  expect(
    testCallbackData.filter({
      id: String(1)
    })
  ).toStrictEqual(/identifier:1:\w+/);

  expect(testCallbackData.filter()).toStrictEqual(/identifier:\w+:\w+/);
});