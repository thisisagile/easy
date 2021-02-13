import { stringify } from './Stringify';
import { meta, Text, toName } from '../types';

export type ParseOptions = { property?: unknown; actual?: unknown };

const props = (subject: unknown = {}, template: Text = ''): string => {
  return meta(subject)
    .entries()
    .reduce((res, [k, v]) => res.replace(`{this.${k}}`, v?.toString() ?? ''), template.toString());
};

export const toText = (subject: unknown, template: Text, options: ParseOptions = {}): Text => {
  return props(
    subject,
    template
      .toString()
      .replace('{type.name}', stringify(toName(subject)).lower)
      .replace('{type.Name}', stringify(toName(subject)).title)
      .replace('{subject.name}', stringify(subject).lower)
      .replace('{subject.Name}', stringify(subject).title)
      .replace('{property}', stringify(options.property).lower)
      .replace('{Property}', stringify(options.property).title)
      .replace('{actual}', stringify(options.actual).lower)
      .replace('{Actual}', stringify(options.actual).title)
  );
};
