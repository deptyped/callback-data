import { DataType } from "./types.ts";

export const serialize = (
  value: number | string | boolean,
  targetType: DataType,
) => {
  if (targetType === Boolean) {
    if (value === true) {
      return "1";
    } else {
      return "0";
    }
  }

  return value.toString();
};

export const deserialize = (value: string, targetType: DataType) => {
  if (targetType === Number) {
    const num = parseFloat(value);

    if (isNaN(num)) {
      throw new Error(
        `Callback data parsing error. Invalid number value ("${value}")`,
      );
    }

    return num;
  }

  if (targetType === Boolean) {
    if (value === "1") {
      return true;
    } else if (value === "0") {
      return false;
    } else {
      throw new Error(
        `Callback data parsing error. Invalid boolean value ("${value}")`,
      );
    }
  }

  return value;
};
