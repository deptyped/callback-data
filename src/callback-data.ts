import { pack, unpack } from './transformers';

export type CallbackDataValues = Record<string | number, string>;

export class CallbackData<T extends CallbackDataValues> {
  private readonly entriesNames: Set<keyof T>;
  private readonly separator: string;

  constructor(
    public identifier: string = '',
    entriesNames: Array<keyof T>,
    separator: string = ':'
  ) {
    if (!entriesNames) {
      throw new Error('Argument `entriesNames` is required');
    }
    if (Array.isArray(entriesNames) === false) {
      throw new Error('Argument `entriesNames` must be an array');
    }

    this.entriesNames = new Set(entriesNames);
    this.separator = separator;
  }

  private _pack(parts: T): string {
    return pack<T>(parts, this.entriesNames, {
      namespace: this.identifier,
      separator: this.separator
    });
  }

  private _unpack(packedData: string): T {
    return unpack<T>(packedData, this.entriesNames, {
      namespace: this.identifier,
      separator: this.separator
    });
  }

  parse(packedData: string): T {
    return this._unpack(packedData);
  }

  create(values: T): string {
    return this._pack(values);
  }

  filter(filters: Partial<T> = {}): RegExp {
    const defaultFilters: T = {} as T;
    for (const entryName of this.entriesNames) {
      defaultFilters[entryName] = '\\w+' as T[keyof T];
    }

    return new RegExp(
      this._pack(Object.assign<T, Partial<T>>(defaultFilters, filters))
    );
  }

  // TODO: Remove in 1.0
  // Deprecated
  new(values: T): string {
    return this.create(values);
  }
}
