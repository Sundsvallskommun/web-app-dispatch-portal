import React from 'react';
import { Batch } from '@interfaces/statistics.interface';
import { PaddedListIcon } from '@components/list-item/padded-list-icon.component';
import { Icon } from '@sk-web-gui/react';
import { Calendar, ChevronRight, Users2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Link from 'next/link';

interface ListItemComponentProps {
  data: Batch;
}

export const getMessagePrefixUrl = (type: string) => {
  switch (type) {
    case 'SMS':
      return '/my-statistics/sms';
    default:
      return '/my-statistics/mail';
  }
};

export const ListItem: React.FC<ListItemComponentProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();

  const messageTypeToHumanReadable = (type: string) => {
    switch (type) {
      case 'SMS':
        return t('common:textMessage');
      case 'SNAIL_MAIL':
        return t('common:letter');
      case 'DIGITAL_MAIL':
        return t('common:letter');
      case 'EMAIL':
        return t('common:letter');
      default:
        return type;
    }
  };

  const isSMS = (type: string) => {
    return type === 'SMS';
  };

  return (
    <Link
      href={`${getMessagePrefixUrl(data?.messageType)}/${data?.batchId}`}
      key={data?.batchId}
      className="flex w-full mb-16 bg-background-content shadow-50 py-16 px-20 rounded-cards justify-between hover:bg-background-color-mixin-1 hover:cursor-pointer focus:ring-2 focus:outline-none"
    >
      <div className="flex w-full lg:items-center justify-between">
        <PaddedListIcon messageType={data.messageType} />

        <div>
          <p>
            <strong>{messageTypeToHumanReadable(data.messageType)}</strong>{' '}
            {isSMS(data.messageType) ? null : `(${data?.subject})`}
          </p>

          <div className="lg:flex items-center text-small gap-8">
            <Icon icon={<Calendar />} size={20} /> {dayjs(data.sent).format('YYYY-MM-DD, HH:mm')}
            <Icon icon={<Users2 />} className="ml-8" size={20} /> {data.recipientCount}{' '}
            {t('statistics:myStatistics.recipient')}
          </div>
        </div>

        <div className="flex flex-1 justify-end ">
          <Icon icon={<ChevronRight />} />
        </div>
      </div>
    </Link>
  );
};
