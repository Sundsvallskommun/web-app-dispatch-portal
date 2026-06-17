import { MessagingSettingsDto } from '@interfaces/messaging-settings';
import { MessagingSettingsRequest } from '@data-contracts/backend/data-contracts';
import { toBase64 } from '@utils/file-utils';
import * as yup from 'yup';
import { TFunction } from 'i18next';

export const createLogotypeSchema = (t: TFunction) =>
  yup.object({
    host: yup.string().trim().required(t('logotypes:errors.host_required')),
    display_name: yup.string().trim().required(t('logotypes:errors.display_name_required')),
    logotype_lightmode: yup
      .mixed<File | string>()
      .required(t('logotypes:errors.logotype_required'))
      .test('not-empty', t('logotypes:errors.logotype_required'), (v) => v !== '' && v != null),
    logotype_darkmode: yup
      .mixed<File | string>()
      .required(t('logotypes:errors.logotype_required'))
      .test('not-empty', t('logotypes:errors.logotype_required'), (v) => v !== '' && v != null),
  });

export const createLogotypeRequestDto = async (data: MessagingSettingsDto): Promise<MessagingSettingsRequest> => {
  return {
    values: [
      {
        key: 'display_name',
        value: data.display_name,
        type: 'STRING',
      },
      {
        key: 'host',
        value: data.host,
        type: 'STRING',
      },
      {
        key: 'logotype_lightmode',
        value:
          data.logotype_lightmode instanceof File ? await toBase64(data.logotype_lightmode) : data.logotype_lightmode,
        type: 'WEB',
      },
      {
        key: 'logotype_darkmode',
        value: data.logotype_darkmode instanceof File ? await toBase64(data.logotype_darkmode) : data.logotype_darkmode,
        type: 'WEB',
      },
    ],
  };
};
