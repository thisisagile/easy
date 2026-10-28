import type { Enum } from '@thisisagile/easy/types/Enum';
import type { Id } from '@thisisagile/easy/types/Id';
import { text } from '@thisisagile/easy/types/ToText';

export const normalizeId = (id: Id): string => text(id).lower.trim.toString();

export const equalsNormalizedId = <E extends Enum>(id: Id, other: E | Id): other is E => text(other).lower.trim.equals(normalizeId(id));
