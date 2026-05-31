export const period = [
  'today',
  'yesterday',
  'tomorrow',
  'this-week',
  'last-seven-days',
  'last-week',
  'last-two-weeks',
  'next-week',
  'this-month',
  'last-month',
  'two-months-ago',
  'three-months-ago',
  'last-three-months',
  'next-month',
  'this-year',
  'last-year',
  'two-years-ago',
  'three-years-ago',
  'next-year',
  'all-time',
] as const;

export type Period = (typeof period)[number];
