import { useState } from 'react';

export const useRev = (initial = 0) => {
  const [rev, setRev] = useState(initial);
  const revalidate = () => setRev(r => r + 1);
  const reset = () => setRev(initial);
  return { rev, revalidate, reset };
};
