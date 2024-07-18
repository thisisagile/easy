import { isDefined } from './Is';
import { isFunc } from './Func';
import { Get, ofGet } from './Get';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t) && isFunc<string, any>((t as any).toString);

export const asString = (t?: unknown, alt: Get<Text> = ''): string => (isText(t) ? t : ofGet(alt)).toString();

export const replaceAll = (origin: Text, search: Text, replace: Text = ''): string => asString(origin).split(asString(search)).join(asString(replace));

export const toWords = (input: unknown): string[] => {
  return asString(input)
    .replace(/(\p{Lower})(\p{Upper})/gu, '$1 $2')
    .replace(/(\p{Upper})(\p{Upper}\p{Lower})/gu, '$1 $2')
    .split(/[_\W]+/g)
    .filter(Boolean);
};

export const kebab = (s = ''): string => toWords(s).join('-').toLowerCase();
