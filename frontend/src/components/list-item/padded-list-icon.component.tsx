import { Mail, MailCheck, Smartphone } from 'lucide-react';
import React from 'react';
import { Icon } from '@sk-web-gui/react';
import { formSendType } from 'src/constants';

type ColorName = NonNullable<React.ComponentProps<typeof Icon>['color']>;

const icons: Record<string, React.ReactElement> = {
  [formSendType.LETTER]: <Mail />,
  [formSendType.SMS]: <Smartphone />,
  [formSendType.REK_MAIL]: <MailCheck />,
};
const colors: Record<string, ColorName> = {
  [formSendType.LETTER]: 'vattjom',
  [formSendType.SMS]: 'gronsta',
  [formSendType.REK_MAIL]: 'bjornstigen',
};
const bgClasses: Record<string, string> = {
  [formSendType.LETTER]: 'bg-vattjom-surface-accent',
  [formSendType.SMS]: 'bg-gronsta-surface-accent',
  [formSendType.REK_MAIL]: 'bg-bjornstigen-surface-accent',
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
