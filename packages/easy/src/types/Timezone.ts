export const timezones = [
  'utc',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/Brussels',
  'Europe/London',
  'Europe/Paris',
  'Europe/Vienna',
  'Europe/Warsaw',
  'America/New_York',
] as const;

export type Timezone = (typeof timezones)[number];

export const timezone = {
  utc: 'utc' as Timezone,
  amsterdam: 'Europe/Amsterdam' as Timezone,
  berlin: 'Europe/Berlin' as Timezone,
  brussels: 'Europe/Brussels' as Timezone,
  london: 'Europe/London' as Timezone,
  paris: 'Europe/Paris' as Timezone,
  vienna: 'Europe/Vienna' as Timezone,
  warsaw: 'Europe/Warsaw' as Timezone,
  newYork: 'America/New_York' as Timezone,
};

export const utc = timezone.utc;
export const ams = timezone.amsterdam;
