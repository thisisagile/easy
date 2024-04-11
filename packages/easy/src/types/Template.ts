import { meta } from './Meta';
import { List, toList } from './List';
import { asString, text, Text, ToText } from './Text';
import { toName } from './Constructor';
import { tryTo } from './Try';

export type TemplateOptions = { type?: Text; property?: Text; actual?: Text; subject?: Text };

export class Template implements Text {
  constructor(
    private readonly template: string,
    private readonly subject: unknown = {},
    private readonly options = {}
  ) {}

  toString = (): string => {
    return meta(this.options)
      .entries()
      .reduce((t, [k]) => this.option(t, k), this.object())
      .replace('  ', ' ');
  };

  private readonly value = (subject: any, prop: string): string =>
    tryTo(() => prop.split('.'))
      .map(p => [p, p.splice(1)])
      .map(([p, ps]) => ps.reduce((t: ToText, s) => (t as any)[s], text(subject[p[0]])))
      .map(p => p.toString()).value;

  private readonly props = (tmpl: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = tmpl.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = tmpl.indexOf('}', i1);
    return this.props(tmpl.slice(i2 + 1), key, result.add(tmpl.substring(i1 + 1, i2)));
  };

  private readonly object = (): string => {
    return this.props(this.template, 'this').reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.subject, p.replace('this.', ''))), this.template);
  };

  private readonly option = (tmpl: string, prop: string): string => {
    return this.props(tmpl, prop).reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.options, p)), tmpl);
  };
}

export const template = (tmpl: Text, subject: unknown, options: TemplateOptions = {}): Text =>
  new Template(asString(tmpl), subject, {
    type: toName(subject),
    subject: text(JSON.stringify(subject)),
    ...options,
  });
