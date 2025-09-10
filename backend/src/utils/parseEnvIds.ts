export const parseEnvIds = (envVar: string | undefined): number[] => {
  if (!envVar) return [];

  const parsed = envVar.split(',').map(id => {
    const num = Number(id.trim());
    if (isNaN(num)) {
      throw new Error(`IFelaktigt ID i DEPARTMENT_IDS: "${id}" är inte ett nummer.`);
    }
    return num;
  });

  return parsed;
};
