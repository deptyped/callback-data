import type { CallbackData, FilterClause, Schema } from "./types.ts";
import { deserialize, serialize } from "./transformers.ts";
import { BOOLEAN_REGEX, NUMBER_REGEX, STRING_REGEX } from "./regex.ts";

const CALLBACK_DATA_SIZE_LIMIT = 64;

type Options = {
  delimiter?: string;
};

export const createCallbackData = <T extends Schema>(
  id: string,
  schema: T,
  options?: Options,
) => {
  if (id.length === 0) {
    throw new Error("Callback data ID cannot be empty.");
  }

  const delimiter = options?.delimiter ?? ":";

  return {
    pack(data: CallbackData<T>) {
      const dataValues = [id];

      for (const field of Object.keys(data).sort()) {
        if (!(field in schema)) {
          continue;
        }

        const dataType = schema[field];
        const dataValue = data[field];

        dataValues.push(serialize(dataValue, dataType));
      }

      if (dataValues.join().includes(delimiter)) {
        throw new Error(
          `Callback data serialization error. Use of delimiter character ("${delimiter}") in data values is not allowed`,
        );
      }

      const packedData = dataValues.join(delimiter);

      if (packedData.length > CALLBACK_DATA_SIZE_LIMIT) {
        throw new Error(
          `Callback data serialization error. Size overflow (${packedData.length} > ${CALLBACK_DATA_SIZE_LIMIT})`,
        );
      }

      return packedData;
    },

    unpack(packedData: string): CallbackData<T> {
      const splittedData = packedData.split(delimiter);
      const unpackedData = new Map();
      const dataId = splittedData.shift();

      if (dataId !== id) {
        throw new Error(
          `Callback data parse error. Invalid callback data ID ("${dataId}" does not match "${id}").`,
        );
      }

      for (const field of Object.keys(schema).sort()) {
        const dataType = schema[field];
        const dataValue = splittedData.shift();

        if (typeof dataValue === "undefined") {
          throw new Error(
            `Callback data parse error. Missing value for "${field}".`,
          );
        }

        unpackedData.set(field, deserialize(dataValue, dataType));
      }

      return Object.fromEntries(unpackedData);
    },

    filter(clause?: FilterClause<T>) {
      const regexValues = [id];

      for (const field of Object.keys(schema).sort()) {
        const dataType = schema[field];
        const clauseValue = clause?.[field];

        if (typeof clauseValue !== "undefined") {
          regexValues.push(serialize(clauseValue, dataType));
          continue;
        }

        if (dataType === Number) {
          regexValues.push(NUMBER_REGEX.source);
        }
        if (dataType === String) {
          regexValues.push(STRING_REGEX.source);
        }
        if (dataType === Boolean) {
          regexValues.push(BOOLEAN_REGEX.source);
        }
      }

      return new RegExp(`^${regexValues.join(delimiter)}$`);
    },
  };
};
