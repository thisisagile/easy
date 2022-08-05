export const traverse = (subject: unknown = {}, property = ''): unknown => {
  const props = property.split('.');
  const p = props.shift() as string;
  return props.length === 0 ? (subject as any)[p] : traverse((subject as any)[p], props.join('.'));
};
