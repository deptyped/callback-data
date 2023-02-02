import { DataType } from "./types.ts";

export const serialize = (value: number | string | boolean, type: DataType) => {
  if (type === Boolean) {
    if (value === true) {
      return "1";
    } else {
      return "0";
    }
  }

  return value.toString();
};

export const deserialize = (value: string, type: DataType) => {
  if (type === Number) {
    return parseFloat(value);
  }

  if (type === Boolean) {
    if (value === "1") {
      return true;
    } else {
      return false;
    }
  }

  return value;
};
