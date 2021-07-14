import { act, render, RenderOptions, RenderResult, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';

export async function waitForRender(ui: ReactElement, options?: Omit<RenderOptions, 'queries'>): Promise<RenderResult> {
  let r = {} as RenderResult;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await act(async () => {
    r = render(ui, options);
    await waitFor(() => r.container, { container: r.container });
  });
  return r;
}
