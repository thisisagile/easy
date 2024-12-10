export * from './ElementTester';
export * from './Tester';
export * from './waitForRender';

export const mockTimezone = () => {
  jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue(Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).resolvedOptions());
};
mockTimezone();
