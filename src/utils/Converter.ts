export class Converter<From = unknown, To = unknown> {
  constructor(public readonly from: (f: From) => To, public readonly to: (t: To) => From) {}
}

export const convert = {
  default: new Converter(
    a => a,
    a => a
  ),
  toBool: {
    fromNumber: new Converter<boolean, number>(
      b => (b ? 1 : 0),
      n => n !== 0
    ),
    fromString: new Converter<boolean, string>(
      b => (b ? 'true' : 'false'),
      s => s !== 'true'
    ),
  },
  toDate: {
    fromString: new Converter<string, string>(
      s => new Date(s).toISOString(),
      s => s
    ),
  },
  toNumber: {
    fromString: new Converter<number, string>(
      n => n.toString(),
      s => parseInt(s)
    ),
  },
};
