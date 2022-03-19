export const traverse = (subject: unknown = {}, property = ''): unknown => {
  const [p, ...props] = property.split('.');
  if (props.length === 0) {
    return (subject as any)[p ?? ''];
  }
  return traverse((subject as any)[p], props.join('.'));
};
