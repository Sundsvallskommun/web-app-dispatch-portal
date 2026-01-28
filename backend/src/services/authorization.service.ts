import { RequestWithUser } from '@/interfaces/auth.interface';
import { getMunicipalityId } from '@/utils/getMunicipalityId';
import { AUTHORIZED_GROUPS, getApiBase } from '@config';
import { InternalRole, Permissions } from '@interfaces/users.interface';
import ApiService, { ApiResponse } from './api.service';
import { logError } from './message.service';
import { roleADMapping } from './ad-role.service';

export const defaultPermissions: () => Permissions = () => ({
  canSendSMS: false,
  canSendLetter: true,
  canSendRegisteredLetter: false,
});

/**
 *
 * @param groups Array of groups/roles
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = async (req: RequestWithUser, apiService: ApiService): Promise<Permissions> => {
  const permissions: Permissions = defaultPermissions();

  const messagingSettings = await getMessagingUserSettings(req, apiService);
  const values = messagingSettings?.[0]?.values || [];

  const settingsMap = Object.fromEntries(values.map(v => [v.key, v.value?.toLowerCase()]));

  permissions.canSendSMS = settingsMap['sms_enabled'] === 'true';
  permissions.canSendRegisteredLetter = settingsMap['rek_enabled'] === 'true';

  return permissions;
};

export const getMessagingUserSettings: (req: RequestWithUser, api: ApiService) => Promise<MessagingSettings[]> = async (
  req,
  api,
) => {
  const municipalityId = await getMunicipalityId(req);
  const url = `${getApiBase('messaging-settings')}/${municipalityId}/user`;
  const headers = {
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };
  return api
    .get<any>({ url, headers }, req.user)
    .then(async (_res: ApiResponse<MessagingSettings[]>) => {
      return _res.data;
    })
    .catch(e => {
      logError('Error when getting messaging settings:', e);
      throw new Error('Error when getting messaging settings');
    });
};

export interface MessagingSettings {
  id: string;
  municipalityId: string;
  created: string;
  updated: string;
  values: MessagingSettingsValue[];
}

export interface MessagingSettingsValue {
  key: string;
  value: string;
  type: string;
}
