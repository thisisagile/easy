import { meta } from '../utils';
import { Uri } from '../types';

export const route = (route: Uri): ClassDecorator =>
  (subject: Function): void => {
    meta(subject).set('route', route);
  };

// <TFunction extends Function>(target: TFunction) => TFunction | void
// // eslint-disable-next-line @typescript-eslint/ban-types
// export function Route<T extends Verifiable>(uri: Uri): <TFunction extends Function>(target: TFunction) => void {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   return <TFunction extends Function>(target: TFunction): void => {
//     reflect(target).uri = uri;
//     reflect(target).route = uri.path;
//     // reflect(target).set("target", t);
//   };
// }
