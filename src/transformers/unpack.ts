import { CallbackDataParseError } from '../errors';
import { CallbackDataValues } from '../callback-data';

export interface UnpackOptions {
  namespace: string;
  separator: string;
}

export const unpack = <T extends CallbackDataValues>(
  packedData: string,
  partsNames: Array<keyof T>,
  options: UnpackOptions
): T => {
  const partsMap = new Map<keyof T, T[keyof T]>();
  const partsItems = packedData.split(options.separator);

  if (typeof options.namespace === 'string' && options.namespace !== '') {
    const deserializedIdentifier = partsItems[0];
    if (deserializedIdentifier !== options.namespace) {
      throw new CallbackDataParseError(
        `The deserialized identifier is invalid. "${deserializedIdentifier}" does not match "${options.namespace}"`
      );
    } else {
      partsItems.shift(); // remove identifier item
    }
  }

  if (partsItems.length !== partsNames.length) {
    throw new CallbackDataParseError(
      `The deserialized parts count is invalid. "${partsItems.length}" does not match "${partsNames.length}"`
    );
  }

  for (const partKey of partsNames) {
    partsMap.set(partKey, partsItems.shift() as T[keyof T]);
  }

  return Object.fromEntries(partsMap) as unknown as T;
};
