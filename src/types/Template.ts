import { meta } from './Meta';
import { List, toList } from './List';
import { text, Text, ToText } from './Text';
import { toName } from './Constructor';

class Template implements Text {
  constructor(private template: string, private subject: unknown = {}, private options = {}) {}

  toString = (): string => {
    return meta(this.options)
      .entries()
      .reduce((t, [k]) => this.option(t, k), this.object());
  };

  private value = (subject: any, prop: string): string => {
    const split = prop.split('.');
    return split
      .splice(1)
      .reduce((t: ToText, s) => (t as any)[s], text(subject[split[0]]))
      .toString();
  };

  private props = (template: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = template.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = template.indexOf('}', i1);
    return this.props(template.slice(i2 + 1), key, result.add(template.substring(i1 + 1, i2)));
  };

  private object = (): string => {
    return this.props(this.template, 'this').reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.subject, p.replace('this.', ''))), this.template);
  };

  private option = (template: string, prop: string): string => {
    return this.props(template, prop).reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.options, p)), template);
  };
}

export const template = (template: Text, subject: unknown, options = {}): Text =>
  new Template(template.toString(), subject, {
    type: toName(subject),
    ...options,
  });
