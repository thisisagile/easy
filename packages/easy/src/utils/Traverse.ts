export const traverse = (subject: unknown = {}, property = ''): unknown => {
  const [p, ...props] = property.split('.');
  return props.length === 0 ? (subject as any)[p] : traverse((subject as any)[p], props.join('.'));
};
