import { asList, defined, Entity, gt, Id, Json, lt, required, Struct, toList } from '../../src';
import { Age } from './Age';
import { Money } from '@thisisagile/easy-domain';

export class Certificate extends Struct {
  static readonly ScrumMaster = new Certificate({ id: 42, name: 'Certified scrum master' });
  static readonly Flow = new Certificate({ id: 1, name: 'The worst agile method in the world called flow' });
  static readonly MVP = new Certificate({ id: 2, name: 'Microsoft valuable professional' });
  static readonly JavaChampion = new Certificate({ id: 3, name: 'Java champion' });

  readonly id = this.state.id as Id;
  readonly name = this.state.name as string;
}

export class Dev extends Entity {
  static readonly Invalid = new Dev({ level: 1 });
  static readonly Jeroen = new Dev({
    id: 1,
    name: 'Jeroen',
    level: 3,
    certificates: [Certificate.ScrumMaster, Certificate.Flow],
  });
  static readonly Naoufal = new Dev({
    id: 2,
    name: 'Naoufal',
    level: 3,
    certificates: [Certificate.ScrumMaster, Certificate.Flow, Certificate.MVP],
  });
  static readonly Sander = new Dev({ id: 3, name: 'Sander', level: 3, certificates: [Certificate.ScrumMaster] });
  static readonly Wouter = new Dev({ id: 4, name: 'Wouter', level: 3 });
  static readonly Rob = new Dev({ id: 5, name: 'Rob', level: 3, salary: { value: 7000, currency: 'EUR' } });
  static readonly Eugen = new Dev({ id: 6, name: 'Eugen', level: 3 });
  static readonly RobC = new Dev({ id: 6, name: 'RobC', level: 3 });
  static readonly All = toList(Dev.Sander, Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Rob, Dev.RobC);

  @required() readonly name: string = this.state.name;
  @defined() readonly language: string = this.state.language ?? 'TypeScript';
  @gt(1) @lt(10) readonly level: number = this.state.level ?? 1;
  readonly certificates = asList(Certificate, this.state.certificates);
  readonly salary: Money = new Money(this.state.salary ?? { amount: 5000, currency: 'EUR' });
  get title(): string {
    return `${this.name} is fluent in ${this.language}.`;
  }

  hasCertificate = (certificate: Certificate): boolean => this.certificates.some(c => c.id === certificate.id);

  toString(): string {
    return this.name;
  }

  is(d: Dev): boolean {
    return d.name === this.name;
  }

  update(add: Json): Dev {
    return new Dev(this.merge(add));
  }

  error = (): string => {
    throw new Error('Error in dev');
  }; // eslint-disable-line @typescript-eslint/no-unused-vars
}

export const isDev = (v: unknown): v is Dev => v instanceof Dev;
