import { CallbackDataParseError } from '../errors';
import { CallbackDataValues } from '../callback-data';

export interface UnpackOptions {
  namespace: string;
  separator: string;
}

export const unpack = <T extends CallbackDataValues>(
  packedData: string,
  partsNames: Set<keyof T>,
  options: UnpackOptions
): T => {
  const entriesItems = packedData.split(options.separator);

  if (typeof options.namespace === 'string' && options.namespace !== '') {
    const deserializedIdentifier = entriesItems[0];
    if (deserializedIdentifier !== options.namespace) {
      throw new CallbackDataParseError(
        `The deserialized identifier is invalid. "${deserializedIdentifier}" does not match "${options.namespace}"`
      );
    } else {
      entriesItems.shift(); // remove identifier item
    }
  }

  if (entriesItems.length !== partsNames.size) {
    throw new CallbackDataParseError(
      `The deserialized parts count is invalid. "${entriesItems.length}" does not match "${partsNames.size}"`
    );
  }

  const entries = {} as T;

  for (const partKey of partsNames) {
    entries[partKey] = entriesItems.shift() as T[keyof T];
  }

  return entries;
};
