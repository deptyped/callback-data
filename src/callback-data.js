const {
  CallbackDataOverflowError,
  CallbackDataParseError,
} = require('./errors');

class CallbackData {
  constructor(prefix = '', parts, separator = ':') {
    if (typeof parts === 'undefined') {
      throw new Error('Argument `parts` is required');
    }
    if (Array.isArray(parts) === false) {
      throw new Error('Argument `parts` must be an array');
    }

    this._partsNames = parts;
    this._prefix = prefix;
    this._separator = separator;
  }

  get prefix() {
    return this._prefix;
  }

  _serialize(partsMap) {
    let serializedValues = '';

    if (typeof this._prefix === 'string' && this._prefix !== '') {
      serializedValues = `${this._prefix}${this._separator}`;
    }

    const valuesIterator = partsMap.entries();
    let item = valuesIterator.next();
    while (item.done === false) {
      const key = item.value[0];
      const value = item.value[1];

      if (typeof value === 'undefined') {
        throw new Error(`Missing value for "${key}"`);
      } else {
        serializedValues += value;
      }

      item = valuesIterator.next();

      if (item.done === false) {
        serializedValues += this._separator;
      }
    }

    if (serializedValues.length > 64) {
      throw new CallbackDataOverflowError(
        `Callback data size overflow (${serializedValues.length} > 64)`
      );
    }

    return serializedValues;
  }

  _deserialize(partsString) {
    const partsMap = new Map();
    const partsItems = partsString.split(this._separator);

    if (typeof this._prefix === 'string' && this._prefix !== '') {
      const deserializedPrefix = partsItems[0];
      if (deserializedPrefix !== this._prefix) {
        throw new CallbackDataParseError(
          `The deserialized prefix is invalid. "${deserializedPrefix}" does not match "${this._prefix}"`
        );
      } else {
        partsItems.shift(); // remove prefix item
      }
    }

    if (partsItems.length !== this._partsNames.length) {
      throw new CallbackDataParseError(
        `The deserialized parts count is invalid. "${partsItems.length}" does not match "${this._partsNames.length}"`
      );
    }

    for (let partKey of this._partsNames) {
      partsMap.set(partKey, partsItems.shift());
    }

    return partsMap;
  }

  parse(partsString) {
    const partsMap = this._deserialize(partsString);
    const partsObj = {};

    for (let part of partsMap) {
      partsObj[part[0]] = part[1];
    }

    return partsObj;
  }

  new(partsValues) {
    let partsMap = new Map();
    this._partsNames.map(p => {
      partsMap.set(p, undefined);
    });

    for (let partKey of this._partsNames) {
      if (partsValues.hasOwnProperty(partKey)) {
        partsMap.set(partKey, partsValues[partKey]);
      }
    }

    return this._serialize(partsMap);
  }

  filter(filters) {
    let partsMap = new Map();
    this._partsNames.map(p => {
      partsMap.set(p, '\\w+');
    });

    for (let partKey of this._partsNames) {
      if (filters.hasOwnProperty(partKey)) {
        partsMap.set(partKey, filters[partKey]);
      }
    }

    return new RegExp(this._serialize(partsMap));
  }
}

module.exports = {
  CallbackData,
};
