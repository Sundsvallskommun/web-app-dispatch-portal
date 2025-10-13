import { Mail, MailCheck, Smartphone } from 'lucide-react';
import React from 'react';
import { Icon } from '@sk-web-gui/react';

type ColorName = NonNullable<React.ComponentProps<typeof Icon>['color']>;

const icons: Record<string, React.ReactElement> = {
  LETTER: <Mail />,
  SMS: <Smartphone />,
  REK: <MailCheck />,
};
const colors: Record<string, ColorName> = {
  LETTER: 'vattjom',
  SMS: 'gronsta',
  REK: 'bjornstigen',
};
const bgClasses: Record<string, string> = {
  LETTER: 'bg-vattjom-surface-accent',
  SMS: 'bg-gronsta-surface-accent',
  REK: 'bg-bjornstigen-surface-accent',
};

interface PaddedListItemComponentProps {
  messageType: string;
}

export const PaddedListIcon: React.FC<PaddedListItemComponentProps> = ({ messageType }) => {
  const mapTypeToIcon = (messageType: string) => icons[messageType] ?? <Mail />;
  const mapTypeToColor = (messageType: string) => colors[messageType] ?? 'vattjom';
  const mapTypeToBgClass = (messageType: string) => bgClasses[messageType] ?? 'bg-vattjom-surface-accent';

  return (
    <div
      className={`${mapTypeToBgClass(messageType)} flex justify-center items-center lg:w-52 lg:h-52 md:h-48 md:w-48 h-32 w-32 md:p-10 p-4 rounded-button mr-16`}
    >
      <Icon color={mapTypeToColor(messageType)} icon={mapTypeToIcon(messageType)} size={30} />
    </div>
  );
};
