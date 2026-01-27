import { AUTHORIZED_GROUPS, getApiBase, MUNICIPALITY_ID } from '@config';
import { Permissions, User } from '@interfaces/users.interface';
import ApiService, { ApiResponse } from './api.service';
import { logError } from './message.service';

export function authorizeGroups(groups) {
  console.log('authorizing groups', groups);
  console.log('against', AUTHORIZED_GROUPS);
  if (!AUTHORIZED_GROUPS) return true; // no authorization groups configured
  const authorizedGroupsList = AUTHORIZED_GROUPS.split(',');
  const groupsList = groups.split(',').map((g: string) => g.toLowerCase());
  return authorizedGroupsList.some(authorizedGroup => groupsList.includes(authorizedGroup.toLowerCase()));
}

export const defaultPermissions: () => Permissions = () => ({
  canSendSMS: false, // NOTE: everyone can send SMS by default
  canSendLetter: true,
  canSendRegisteredLetter: false,
});

/**
 *
 * @param groups Array of groups/roles
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = async (user: User, apiService: ApiService): Promise<Permissions> => {
  const permissions: Permissions = defaultPermissions();

  const messagingSettings = await getMessagingUserSettings(user, apiService);
  const values = messagingSettings?.[0]?.values || [];

  const settingsMap = Object.fromEntries(values.map(v => [v.key, v.value?.toLowerCase()]));

  permissions.canSendSMS = settingsMap['sms_enabled'] === 'true';
  permissions.canSendRegisteredLetter = settingsMap['rek_enabled'] === 'true';

  return permissions;
};

export const getMessagingUserSettings: (user: User, api: ApiService) => Promise<MessagingSettings[]> = async (
  user,
  api,
) => {
  const url = `${getApiBase('messaging-settings')}/${MUNICIPALITY_ID}/user`;
  const headers = {
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };
  return api
    .get<any>({ url, headers }, user)
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
