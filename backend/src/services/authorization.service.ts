import { AUTHORIZED_GROUPS } from '@config';
import { InternalRole, InternalRoleEnum, Permissions, User } from '@interfaces/users.interface';
import { roleADMapping } from './ad-role.service';
import ApiService, { ApiResponse } from './api.service';
import { logError } from './message.service';

const MESSAGING_SETTINGS_PATH = `messaging-settings/2.0`;
const MUNICIPALITY_ID = '2281';

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

enum RoleOrderEnum {
  'sms',
}

const roles = new Map<InternalRoleEnum, Partial<Permissions>>([
  [
    InternalRoleEnum.SMS,
    {
      canSendSMS: true,
    },
  ],
]);

/**
 *
 * @param groups Array of groups/roles
 * @param internalGroups Whether to use internal groups or external group-mappings
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = async (
  groups: InternalRole[] | string[],
  user: User,
  apiService: ApiService,
  internalGroups = false,
): Promise<Permissions> => {
  const permissions: Permissions = defaultPermissions();
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = internalGroups ? (groupLower as InternalRoleEnum) : roleADMapping[groupLower];
    if (roles.has(role)) {
      const groupPermissions = roles.get(role);
      Object.keys(groupPermissions).forEach(permission => {
        if (groupPermissions[permission] === true) {
          permissions[permission] = true;
        }
      });
    }
  });

  const messagingSettings = await getMessagingUserSettings(user, apiService);
  const messagingSettingValues = messagingSettings?.[0]?.values || [];
  const flag = (key: string) => messagingSettingValues.find(v => v.key === key)?.value?.toLowerCase() === 'true';
  permissions.canSendSMS = flag('sms_enabled');
  permissions.canSendRegisteredLetter = flag('rek_enabled');

  return permissions;
};

/**
 * Ensures to return only the role with most permissions
 * @param groups List of AD roles
 * @returns role with most permissions
 */
export const getRole = (groups: string[]): InternalRole => {
  if (groups.length == 1) return roleADMapping[groups[0]];

  const roles: InternalRole[] = [];
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = roleADMapping[groupLower];
    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => RoleOrderEnum[a] - RoleOrderEnum[b])[0];
};

export const getMessagingUserSettings: (user: User, api: ApiService) => Promise<MessagingSettings[]> = async (
  user,
  api,
) => {
  const url = `${MESSAGING_SETTINGS_PATH}/${MUNICIPALITY_ID}/user`;
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
