export const apiURL = (...parts: string[]): string => {
  const urlParts = [process.env.NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_PATH, ...parts];
  const urlString = urlParts.map((pathPart) => pathPart?.replaceAll(/(^\/|\/$)/g, ''))?.join('/');
  return urlString;
};
