export const parseEnvIds = (envDepartments: string | undefined): number[] => {
  if (!envDepartments) return [];

  const parsed = envDepartments.split(',').map(id => {
    const num = Number(id.trim());
    if (isNaN(num)) {
      throw new Error(`Felaktigt ID i DEPARTMENT_IDS: "${id}" är inte ett nummer.`);
    }
    return num;
  });

  return parsed;
};
