import { isA, Json, JsonValue } from '../types';

type InOut = {
  name: string,
  in: (key: string, source?: Json) => JsonValue | undefined,
  out: (key: string, source?: Json) => JsonValue | undefined,
}

const isInOut = (io?: unknown): io is InOut => isA<InOut>(io, 'in', 'out');
