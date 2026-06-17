import { Logotype } from '@interfaces/logotypes.interface';
import { MessagingSettings } from '@/data-contracts/messaging-settings/data-contracts';

const LOGOTYPE_KEYS = ['host', 'display_name', 'logotype_lightmode', 'logotype_darkmode'] as const;
type LogotypeKey = (typeof LOGOTYPE_KEYS)[number];

export const structureLogotype = (d: MessagingSettings): Logotype => {
  const fields = d.values.reduce<Partial<Record<LogotypeKey, string>>>((acc, v) => {
    if ((LOGOTYPE_KEYS as readonly string[]).includes(v.key)) {
      acc[v.key as LogotypeKey] = v.value;
    }
    return acc;
  }, {});

  return {
    id: d.id,
    host: fields.host ?? '',
    display_name: fields.display_name ?? '',
    logotype_lightmode: fields.logotype_lightmode,
    logotype_darkmode: fields.logotype_darkmode,
    createdAt: d.created,
    updatedAt: d.updated,
  };
};

export const structureLogotypeData = (data: MessagingSettings[]): Logotype[] => data.map(structureLogotype);
