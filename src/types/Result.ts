import { isA } from './IsA';
import { Text } from './Text';
import { ctx } from './Context';

export type Result = { message: Text; domain?: string; location?: string };

export const result = (message: Text, domain = ctx.env.domain, location?: string): Result => ({ message, domain, location });

export const isResult = (r?: unknown): r is Result => isA<Result>(r, 'message');
