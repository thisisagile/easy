import { isA } from './IsA';
import { Text } from './Text';
import { ctx } from './Context';

export type Result = { message: string; location?: string; domain?: string };

export const toResult = (message: Text, location?: Text, domain: Text = ctx.env.domain): Result => ({
  message: message.toString(),
  location: location?.toString(),
  domain: domain?.toString(),
});

export const isResult = (r?: unknown): r is Result => isA<Result>(r, 'message');
