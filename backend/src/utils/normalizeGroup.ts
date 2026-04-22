export const normalizeGroup = (group?: string | null): string => {
  if (!group) return '';

  return group.trim().replace(/^['"‘’“”]+|['"‘’“”]+$/g, '').toLowerCase();
};

export const parseConfiguredGroups = (groups?: string | null): string[] => {
  if (!groups) return [];

  return groups
    .split(',')
    .map(normalizeGroup)
    .filter(Boolean);
};
