import { CallbackDataOverflowError } from '../errors';

export interface PackOptions {
  namespace: string;
  separator: string;
}

export const pack = <T>(
  entries: T,
  entriesNamesOrder: Set<keyof T>,
  options: PackOptions
): string => {
  const orderedEntries = [];

  if (typeof options.namespace === 'string' && options.namespace !== '') {
    orderedEntries.push(options.namespace);
  }

  for (const entryName of entriesNamesOrder) {
    if (entries.hasOwnProperty(entryName)) {
      orderedEntries.push(entries[entryName]);
    } else {
      throw new Error(`Missing value for "${entryName}"`);
    }
  }

  const packedEntries = orderedEntries.join(options.separator);

  if (packedEntries.length > 64) {
    throw new CallbackDataOverflowError(
      `Callback data size overflow (${packedEntries.length} > 64)`
    );
  }

  return packedEntries;
};
