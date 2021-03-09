import { meta, text, Text, toName } from '../types';

export type ParseOptions = { property?: unknown; actual?: unknown };

const props = (subject: unknown = {}, template: Text = ''): string => {
  return meta(subject)
    .entries()
    .reduce((res, [k, v]) => res.replace(`{this.${k}}`, v?.toString() ?? ''), template.toString());
};

export const toText = (subject: unknown, template: Text, options: ParseOptions = {}): Text => {
  const t = template
    .toString()
    .replace('{type.name}', text(toName(subject)).lower.toString())
    .replace('{type.Name}', text(toName(subject)).title.toString())
    .replace('{subject.name}', text(subject).lower.toString())
    .replace('{subject.Name}', text(subject).title.toString())
    .replace('{property}', text(options.property).lower.toString())
    .replace('{Property}', text(options.property).title.toString())
    .replace('{actual}', text(options.actual).lower.toString())
    .replace('{Actual}', text(options.actual).title.toString())
  return props(subject, t);
};
