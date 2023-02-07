import { asString, isA, RouteGateway, TypeGuard, Typo, View, view, views } from '../../src';
import { DevUri } from './DevUri';
import { Dev } from './Dev';

const { keep } = views;

export type DevType = { name: string; level: string; certificates: [] };

export const isDevType: TypeGuard<DevType> = (d?: unknown): d is DevType => isA<DevType>(d, 'name', 'level', 'certificates');

export const developers = view<DevType>({
  name: keep,
  level: d => asString(d.level),
  certificates: (d: Dev) => d.certificates.map(c => c.id),
});

export class DevTypo extends Typo<DevType> {
  constructor(
    readonly developers: View<DevType>,
    readonly devs = new RouteGateway(
      () => DevUri.Developers,
      () => DevUri.Developer
    )
  ) {
    super(developers, devs);
  }
}
