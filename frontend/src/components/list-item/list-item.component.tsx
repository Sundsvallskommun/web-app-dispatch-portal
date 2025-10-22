import React from 'react';
import { BatchListItem } from '@interfaces/statistics.interface';
import { PaddedListIcon } from '@components/list-item/padded-list-icon.component';
import { Icon } from '@sk-web-gui/react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import Link from 'next/link';
import { formSendType } from 'src/constants';

interface ListItemComponentProps {
  data: BatchListItem;
}

export const getMessagePrefixUrl = (type: string) => {
  switch (type) {
    case formSendType.SMS:
      return '/my-statistics/sms';
    case formSendType.REK_MAIL:
      return '/my-statistics/rek-mail';
    default:
      return '/my-statistics/mail';
  }
};
dayjs.locale('sv');

export const ListItem: React.FC<ListItemComponentProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();

  const messageTypeToHumanReadable = (type: string) => {
    switch (type) {
      case formSendType.SMS:
        return t('common:textMessage');
      case formSendType.REK_MAIL:
        return t('common:recLetter');
      case formSendType.SNAIL_MAIL:
      case formSendType.DIGITAL_MAIL:
      case formSendType.EMAIL:
      case formSendType.LETTER:
        return t('common:letter');
      default:
        return type;
    }
  };

  const isSMS = (type: string) => {
    return type === formSendType.SMS;
  };

  return (
    <Link
      href={`${getMessagePrefixUrl(data?.messageType)}/${data?.id}`}
      key={data?.id}
      className="flex w-full mb-16 bg-background-content shadow-50 py-16 px-20 rounded-cards justify-between hover:bg-background-color-mixin-1 hover:cursor-pointer focus:ring-2 focus:outline-none"
    >
      <div className="flex w-full sm:items-center justify-between">
        <PaddedListIcon messageType={data.messageType} />
        <div>
          {isSMS(data.messageType) ? (
            <span className="text-large text-dark-primary font-normal">
              {messageTypeToHumanReadable(data.messageType)}
            </span>
          ) : (
            <span className="text-large text-dark-primary">{`${data?.subject} (${messageTypeToHumanReadable(data.messageType)})`}</span>
          )}
          <div className="sm:flex block items-center text-base gap-8">
            <p className="flex items-center gap-8 font-normal text-dark-secondary">
              {dayjs(data.sent).format('DD MMM YYYY, HH.mm').toLocaleLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-1 justify-end ">
          <Icon icon={<ChevronRight />} />
        </div>
      </div>
    </Link>
  );
};
