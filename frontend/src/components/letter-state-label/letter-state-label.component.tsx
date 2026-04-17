import React from 'react';
import { useTranslation } from 'react-i18next';
import 'dayjs/locale/sv';
import { Label } from '@sk-web-gui/react';
import { EnumLetterState } from '@interfaces/statistics.interface';

interface LetterStateProps {
  state: EnumLetterState;
}

export const LetterStateLabel: React.FC<LetterStateProps> = (props) => {
  const { state } = props;
  const { t } = useTranslation('statistics');

  const getStateLabel = (state: string) => {
    switch (state) {
      case EnumLetterState.NEW:
        return (
          <Label color="vattjom" inverted rounded>
            {t('statistics:myStatistics.signingInfo.new')}
          </Label>
        );
      case EnumLetterState.SENT:
        return (
          <Label color="vattjom" inverted rounded>
            {t('statistics:myStatistics.signingInfo.sent')}
          </Label>
        );
      case EnumLetterState.PENDING:
        return (
          <Label color="warning" inverted rounded>
            {t('statistics:myStatistics.signingInfo.pending')}
          </Label>
        );
      case EnumLetterState.SIGNED:
        return (
          <Label color="gronsta" inverted rounded>
            {t('statistics:myStatistics.signingInfo.signed')}
          </Label>
        );
      case EnumLetterState.EXPIRED:
        return (
          <Label inverted rounded>
            {t('statistics:myStatistics.signingInfo.expired')}
          </Label>
        );
      case EnumLetterState.FAILED:
      case EnumLetterState.FAILED_Server_Error:
      case EnumLetterState.FAILED_Client_Error:
      case EnumLetterState.FAILED_Unknown_Error:
        return (
          <Label color="error" inverted rounded>
            {t('statistics:myStatistics.signingInfo.failed')}
          </Label>
        );
      default:
        return (
          <Label inverted rounded>
            {t('statistics:myStatistics.status.default')}
          </Label>
        );
    }
  };

  return getStateLabel(state);
};
