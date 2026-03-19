import { useState } from './useState';

export const useRev = (initial = 0) => {
  const [rev, setRev, reset] = useState(initial);
  const revalidate = () => setRev(r => r + 1);
  return { rev, revalidate, reset };
};
