import { meta } from './Meta';
import { List, toList } from './List';
import { asString, text, Text, ToText } from './Text';
import { toName } from './Constructor';

export type TemplateOptions = { type?: Text; property?: Text; actual?: Text };

class Template implements Text {
  constructor(private template: string, private subject: unknown = {}, private options = {}) {}

  toString = (): string => {
    return meta(this.options)
      .entries()
      .reduce((t, [k]) => this.option(t, k), this.object())
      .replace('  ', ' ');
  };

  private value = (subject: any, prop: string): string => {
    const split = prop.split('.');
    return split
      .splice(1)
      .reduce((t: ToText, s) => (t as any)[s], text(subject[split[0]]))
      .toString();
  };

  private props = (tmpl: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = tmpl.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = tmpl.indexOf('}', i1);
    return this.props(tmpl.slice(i2 + 1), key, result.add(tmpl.substring(i1 + 1, i2)));
  };

  private object = (): string => {
    return this.props(this.template, 'this').reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.subject, p.replace('this.', ''))), this.template);
  };

  private option = (tmpl: string, prop: string): string => {
    return this.props(tmpl, prop).reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.options, p)), tmpl);
  };
}

export const template = (tmpl: Text, subject: unknown, options: TemplateOptions = {}): Text =>
  new Template(asString(tmpl), subject, {
    type: toName(subject),
    ...options,
  });
