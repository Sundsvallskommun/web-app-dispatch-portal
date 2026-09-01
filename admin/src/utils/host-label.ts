export const hostLabel = (name: string): string => {
  const label = name.split('.')[0];
  return label === 'localhost' ? 'sundsvall' : label;
};
