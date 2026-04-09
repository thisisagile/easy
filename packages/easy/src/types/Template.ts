import { List, toList } from './List';
import { asString, Text } from './Text';
import { toName } from './Constructor';
import { entries } from './Object';
import { text, textValue } from './ToText';
import { tryTo } from './Try';

export type TemplateOptions = { type?: Text; property?: Text; actual?: Text; subject?: Text };

export class Template implements Text {
  private knownPrefixes = new Set(['type', 'property', 'actual', 'subject']);

  constructor(
    private readonly template: string,
    private readonly subject: unknown = {},
    private readonly options: TemplateOptions = {}
  ) {}

  toString = (): string => {
    return entries(this.options)
      .reduce((t, [k]) => this.option(t, k), this.object())
      .replace('  ', ' ');
  };

  private readonly props = (tmpl: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = tmpl.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = tmpl.indexOf('}', i1);
    return this.props(tmpl.slice(i2 + 1), key, result.add(tmpl.substring(i1 + 1, i2)));
  };

  private readonly object = (): string =>
    tryTo(() => this.template.replace(/\{this\./g, '{'))
      .map(t => t.replace(/\{([^}]+)}/g, (match, p) => (this.knownPrefixes.has(p.split('.')[0]) ? match : textValue(this.subject, p))))
      .or('');

  private readonly option = (tmpl: string, prop: string): string => {
    return this.props(tmpl, prop).reduce((t: string, p) => t.replace(`{${p}}`, textValue(this.options, p)), tmpl);
  };
}

export function template(tmpl: Text, subject: unknown, options: TemplateOptions = {}): Text {
  return new Template(asString(tmpl), subject, {
    type: toName(subject),
    subject: text(JSON.stringify(subject)),
    ...options,
  });
}
