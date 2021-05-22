import { CallbackDataOverflowError } from '../errors';

export interface PackOptions {
  namespace: string;
  separator: string;
}

export const pack = <T>(data: T, options: PackOptions): string => {
  let packedValues = '';

  if (typeof options.namespace === 'string' && options.namespace !== '') {
    packedValues = `${options.namespace}${options.separator}`;
  }

  const iterator = new Map(Object.entries(data)).entries();
  let item = iterator.next();
  while (item.done === false) {
    const key = item.value[0];
    const value = item.value[1];

    if (typeof value === 'undefined') {
      throw new Error(`Missing value for "${key}"`);
    } else {
      packedValues += value;
    }

    item = iterator.next();

    if (item.done === false) {
      packedValues += options.separator;
    }
  }

  if (packedValues.length > 64) {
    throw new CallbackDataOverflowError(
      `Callback data size overflow (${packedValues.length} > 64)`
    );
  }

  return packedValues;
};
