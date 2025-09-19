import { Mail, MailCheck, Smartphone } from 'lucide-react';
import React from 'react';
import { Icon } from '@sk-web-gui/react';

interface PaddedListItemComponentProps {
  messageType: string;
}

export const PaddedListIcon: React.FC<PaddedListItemComponentProps> = (props) => {
  const { messageType } = props;

  const icons: Record<string, React.ReactElement> = {
    letter: <Mail />,
    SMS: <Smartphone />,
    rek: <MailCheck />,
  };

  const translateType = (messageType: string) => icons[messageType] ?? <Mail />;

  return (
    <div className="bg-vattjom-surface-accent flex justify-center items-center lg:w-52 lg:h-52 md:h-48 md:w-48 h-32 w-32 md:p-0 p-4 rounded-button mr-16">
      <Icon icon={translateType(messageType)} size={30} />
    </div>
  );
};
