import { Button, Icon } from '@sk-web-gui/react';
import { BadgeCheck } from 'lucide-react';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';

interface SuccessContainerProps {
  title: string;
  message: string;
  sendNewBtntext: string;
  onClick: () => void;
}

const SuccessContainer = ({ title, message, sendNewBtntext, onClick }: SuccessContainerProps) => {
  const { t } = useTranslation(['common', 'send-mail']);

  return (
    <div className="text-center mt-64">
      <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
      <h1 className="text-h2-sm md:text-h2-md xl:text-h2-lg mt-24">{title}</h1>
      <p className="my-md text-base">{message}</p>
      <div className="flex gap-16 justify-center mt-40">
        <Button
          className="mt-lg"
          color="primary"
          variant="secondary"
          onClick={() => {
            onClick();
          }}
        >
          {sendNewBtntext}
        </Button>
        <NextLink href="/" className="sk-btn sk-btn-md sk-btn-primary mt-lg" data-color="vattjom">
          {t('send-mail:goBack')}
        </NextLink>
      </div>
    </div>
  );
};

export default SuccessContainer;
