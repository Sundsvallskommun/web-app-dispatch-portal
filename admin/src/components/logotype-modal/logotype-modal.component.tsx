'use client';

import { Logotype } from '@data-contracts/backend/data-contracts';
import { Button, cx, Modal, Spinner, useGui } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { useResource } from '@utils/use-resource';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

interface LogotypeModalProps {
  open: boolean;
  onClose: (logotype?: Logotype) => void;
}

export const LogotypeModal: React.FC<LogotypeModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { data, loaded } = useResource('logotypes');
  const [selected, setSelected] = useState<Logotype | undefined>(undefined);
  const { colorScheme, preferredColorScheme } = useGui();
  const mode = colorScheme === 'system' ? preferredColorScheme : colorScheme;
  const property = `url${capitalize(mode)}Mode` as 'urlLightMode' | 'urlDarkMode';

  const handleClose = (logo?: Logotype) => {
    onClose(logo);
    setSelected(undefined);
  };
  return (
    <Modal
      show={open}
      onClose={onClose}
      label={capitalize(t('common:select_resource', { resource: t('logotypes:name_one') }))}
    >
      <Modal.Content>
        {!loaded ?
          <Spinner />
        : <div className="grid grid-cols-8 gap-24">
            {data.map((logotype: Logotype) => {
              const url = logotype?.[property] ?? logotype.urlLightMode;
              return (
                <div
                  key={`${logotype.id}-${logotype.name}`}
                  role="radio"
                  className={cx('max-h-[8rem] max-w-[8rem] focus-visible:ring ring-ring cursor-pointer', {
                    ['border-2 border-success-text-primary shadow-50 bg-success-background-200']:
                      selected?.id === logotype.id,
                  })}
                  aria-checked={selected?.id === logotype.id}
                  tabIndex={0}
                  onClick={() => setSelected(logotype)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === '') {
                      setSelected(logotype);
                    }
                  }}
                >
                  <Image src={apiURL(url)} width="75" height="75" className="h-auto max-h-full object-contain" alt="" />
                </div>
              );
            })}
          </div>
        }
      </Modal.Content>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClose()}>
          {capitalize(t('common:cancel'))}
        </Button>
        <Button disabled={!selected} onClick={() => handleClose(selected)}>
          {capitalize(t('common:select_resource', { resource: t('logotypes:name_one') }))}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
