import { Mail, MailCheck, Smartphone } from 'lucide-react';
import React from 'react';
import { Icon } from '@sk-web-gui/react';
import { formSendType } from 'src/constants';

type ColorName = NonNullable<React.ComponentProps<typeof Icon>['color']>;

const icons: Record<string, React.ReactElement> = {
  [formSendType.LETTER]: <Mail />,
  [formSendType.SMS]: <Smartphone />,
  [formSendType.DIGITAL_REGISTERED_LETTER]: <MailCheck />,
};
const colors: Record<string, ColorName> = {
  [formSendType.LETTER]: 'vattjom',
  [formSendType.SMS]: 'gronsta',
  [formSendType.DIGITAL_REGISTERED_LETTER]: 'bjornstigen',
};
const bgClasses: Record<string, string> = {
  [formSendType.LETTER]: 'bg-vattjom-surface-accent',
  [formSendType.SMS]: 'bg-gronsta-surface-accent',
  [formSendType.DIGITAL_REGISTERED_LETTER]: 'bg-bjornstigen-surface-accent',
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
