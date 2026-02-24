export const appURL = (path?: string): string => {
  return `${globalThis.location.origin}${process?.env?.NEXT_PUBLIC_BASE_PATH ?? ''}${path ?? ''}`;
};
