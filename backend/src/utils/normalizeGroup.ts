const QUOTE_CHARS = new Set(["'", '"', '‘', '’', '“', '”']);

const trimQuotes = (value: string): string => {
  let start = 0;
  let end = value.length;

  while (start < end && QUOTE_CHARS.has(value[start])) start++;
  while (end > start && QUOTE_CHARS.has(value[end - 1])) end--;

  return value.slice(start, end);
};

export const normalizeGroup = (group?: string | null): string => {
  if (!group) return '';

  return trimQuotes(group.trim()).toLowerCase();
};

export const parseConfiguredGroups = (groups?: string | null): string[] => {
  if (!groups) return [];

  return groups.split(',').map(normalizeGroup).filter(Boolean);
};
