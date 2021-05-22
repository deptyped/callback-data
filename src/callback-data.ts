import { pack, unpack } from './transformers';

export type CallbackDataValues = Record<string | number, string>;

export class CallbackData<T extends CallbackDataValues> {
  private readonly partsNames: Array<keyof T>;
  private readonly separator: string;

  constructor(
    public identifier: string = '',
    parts: Array<keyof T>,
    separator: string = ':'
  ) {
    if (!parts) {
      throw new Error('Argument `parts` is required');
    }
    if (Array.isArray(parts) === false) {
      throw new Error('Argument `parts` must be an array');
    }

    this.partsNames = parts;
    this.separator = separator;
  }

  _pack(parts: T): string {
    return pack<T>(parts, {
      namespace: this.identifier,
      separator: this.separator
    });
  }

  _unpack(packedData: string): T {
    return unpack<T>(packedData, this.partsNames, {
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
    const defaultFilters = Object.fromEntries<T[keyof T]>(
      new Map<keyof T, T[keyof T]>(
        this.partsNames.map((name): [keyof T, T[keyof T]] => [
          name,
          '\\w+' as T[keyof T]
        ])
      )
    ) as unknown as T;

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
