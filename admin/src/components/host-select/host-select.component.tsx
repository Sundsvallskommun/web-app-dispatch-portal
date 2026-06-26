import resources from '@config/resources';
import { Host, MessagingSettings } from '@data-contracts/backend/data-contracts';
import { FormControl, FormErrorMessage, FormLabel, Select, Spinner, useSnackbar } from '@sk-web-gui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface HostSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  field: string;
  currentHost?: string;
}

export const HostSelect: React.FC<HostSelectProps> = ({ field, currentHost, ...rest }) => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const [hosts, setHosts] = useState<Host[]>([]);
  const [takenHosts, setTakenHosts] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const message = useSnackbar();

  useEffect(() => {
    Promise.all([resources.hosts.getMany(), resources.logotypes.getMany()])
      .then(([hostsRes, logosRes]) => {
        setHosts(hostsRes.data.data ?? []);
        const taken = (logosRes.data.data ?? [])
          .map((l: MessagingSettings & { host?: string }) => l.host)
          .filter((h): h is string => Boolean(h));
        setTakenHosts(new Set(taken));
        setLoaded(true);
      })
      .catch(() => message({ message: t('logotypes:error.loading_hosts'), status: 'error' }));
  }, []);

  const options = useMemo(
    () => hosts.filter((h) => h.name && (h.name === currentHost || !takenHosts.has(h.name))),
    [hosts, takenHosts, currentHost]
  );

  if (!loaded) return <Spinner />;

  return (
    <FormControl className="w-full" required>
      <FormLabel>{t('logotypes:properties.host')}</FormLabel>
      <Select className="w-full" data-cy="edit-logotype-host" {...register(field)} {...rest}>
        <Select.Option value="">{t('logotypes:select_host_placeholder')}</Select.Option>
        {options.map((host) => (
          <Select.Option key={`host-select-${host.id}`} value={host.name}>
            {host.name}
          </Select.Option>
        ))}
      </Select>
      {errors[field] && <FormErrorMessage>{errors[field]?.message as string}</FormErrorMessage>}
    </FormControl>
  );
};
