import { describe, expect, test } from 'vitest';
import { toMatchException } from '../../src';

const withReason = { id: 'DoesNotExist', reason: 'Could not find it' };
const withoutReason = { id: 'DoesNotExist' };
const noId = {};
const wrongId = { id: 'Wrong' };

describe('toBeValid', () => {
  test('fails', () => {
    expect(toMatchException(withReason, noId)).toFailMatcherWith('Expected value is not an exception.');
    expect(toMatchException(withReason, wrongId)).toFailMatcherWith("Expected exception has id 'Wrong', while the received exception has id 'DoesNotExist'.");
    expect(toMatchException(withReason, wrongId, 'Wrong')).toFailMatcherWith(
      "Expected exception has id 'Wrong', while the received exception has id 'DoesNotExist'."
    );
    expect(toMatchException(withReason, withReason, 'Wrong')).toFailMatcherWith(
      "We expected to have reason 'Wrong', but we received reason 'Could not find it'."
    );
    expect(toMatchException(withoutReason, withoutReason, 'Wrong')).toFailMatcherWith("We expected to have reason 'Wrong', but we received no reason.");
  });

  test('passes', () => {
    expect(toMatchException(withoutReason, withoutReason)).toPassMatcherWith('Expected exception matches received exception, which we did not expect.');
    expect(toMatchException(withReason, withReason, withReason.reason)).toPassMatcherWith(
      'Expected exception matches received exception, which we did not expect.'
    );
  });
});
