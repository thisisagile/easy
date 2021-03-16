import { meta, text, Text, toName, toString } from '../types';

export type ParseOptions = { property?: unknown; actual?: unknown };

const props = (subject: unknown = {}, template: Text = ''): string =>
  meta(subject)
    .entries()
    .reduce((res, [k, v]) => res.replace(`{this.${k}}`, toString(v)), toString(template));

export const toText = (subject: unknown, template: Text, options: ParseOptions = {}): Text =>
  text(template)
    .replace('{type.name}', text(toName(subject)).lower)
    .replace('{type.name}', text(toName(subject)).lower)
    .replace('{type.Name}', text(toName(subject)).title)
    .replace('{subject.name}', text(subject).lower)
    .replace('{subject.Name}', text(subject).title)
    .replace('{property}', text(options.property).lower)
    .replace('{Property}', text(options.property).title)
    .replace('{actual}', text(options.actual).lower)
    .replace('{Actual}', text(options.actual).title)
    .map(t => props(subject, t));
