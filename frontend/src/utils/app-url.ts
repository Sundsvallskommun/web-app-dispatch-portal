export const appURL = (...parts: string[]): string => {
  const urlParts = [`${globalThis.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}`, ...parts];
  return urlParts.map((pathPart) => pathPart?.replace(/(^\/|\/$)/g, '')).join('/');
};
