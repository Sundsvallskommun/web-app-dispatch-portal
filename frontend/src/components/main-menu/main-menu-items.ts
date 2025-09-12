type MainMenuItemProps = {
  href: string;
  label: 'sendMessage' | 'myStatistics' | 'statistics';
};

export const mainMenuItems: MainMenuItemProps[] = [
  {
    href: '/',
    label: 'sendMessage',
  },
  {
    href: '/my-statistics',
    label: 'myStatistics',
  },
  {
    href: '/statistics',
    label: 'statistics',
  },
];
