import { asString } from '../types/Text';

export class Convert<From = unknown, To = unknown> {
  constructor(
    public readonly from: (f: From) => To,
    public readonly to: (t: To) => From
  ) {}
}

export const convert = {
  default: new Convert<any, any>(
    a => a,
    a => a
  ),
  ignore: new Convert<any, any>(
    () => undefined,
    () => undefined
  ),
  toBool: {
    fromNumber: new Convert<boolean, number>(
      b => (b ? 1 : 0),
      n => n !== 0
    ),
    fromString: new Convert<boolean, string>(
      b => (b ? 'true' : 'false'),
      s => s === 'true'
    ),
  },
  toDate: {
    fromString: new Convert<string, string>(
      s => new Date(s).toISOString(),
      s => s
    ),
  },
  toNumber: {
    fromString: new Convert<number, string>(
      n => asString(n),
      s => parseInt(s)
    ),
  },
};
