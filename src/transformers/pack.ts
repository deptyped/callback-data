import { CallbackDataOverflowError } from '../errors';

export interface PackOptions {
  namespace: string;
  separator: string;
}

export const pack = <T extends object>(
  entries: T,
  entriesNamesOrder: Set<keyof T>,
  options: PackOptions
): string => {
  const orderedEntries: Array<keyof T> = [];

  if (options.namespace !== '') {
    orderedEntries.push(options.namespace as keyof T);
  }

  for (const entryName of entriesNamesOrder) {
    if (entries.hasOwnProperty(entryName)) {
      if (String(entries[entryName]).includes(options.separator)) {
        throw new Error(
          `Use of separator (${options.separator}) in data is prohibited`
        );
      }

      orderedEntries.push(entries[entryName] as unknown as keyof T);
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
