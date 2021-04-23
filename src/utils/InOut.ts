import { Json, JsonValue } from '../types';

type InOut = {
  name: string,
  in: (key: string, source?: Json) => JsonValue | undefined,
  out: (key: string, source?: Json) => JsonValue | undefined,
}
