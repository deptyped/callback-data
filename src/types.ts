export type DataType =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor;

export type Schema = {
  [key in string]: DataType;
};

export type ValueOf<T> = T extends NumberConstructor ? number
  : T extends StringConstructor ? string
  : T extends BooleanConstructor ? boolean
  : never;

export type CallbackData<T> = {
  [key in keyof T]: ValueOf<T[key]>;
};

export type FilterClause<T> = Partial<CallbackData<T>>;
