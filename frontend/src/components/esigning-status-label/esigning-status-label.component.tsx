import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@sk-web-gui/react';
import { EnumEsigningStatus } from '@interfaces/statistics.interface';

interface EsigningStatusLabelProps {
  status?: string;
}

export const EsigningStatusLabel: React.FC<EsigningStatusLabelProps> = ({ status }) => {
  const { t } = useTranslation('statistics');

  switch (status) {
    case EnumEsigningStatus.PENDING:
      return (
        <Label color="vattjom" inverted rounded>
          {t('statistics:myStatistics.esigningStatus.sent')}
        </Label>
      );
    case EnumEsigningStatus.SIGNED:
      return (
        <Label color="gronsta" inverted rounded>
          {t('statistics:myStatistics.esigningStatus.signed')}
        </Label>
      );
    case EnumEsigningStatus.DECLINED:
      return (
        <Label color="error" inverted rounded>
          {t('statistics:myStatistics.esigningStatus.declined')}
        </Label>
      );
    default:
      return (
        <Label inverted rounded>
          {t('statistics:myStatistics.unknown')}
        </Label>
      );
  }
};
