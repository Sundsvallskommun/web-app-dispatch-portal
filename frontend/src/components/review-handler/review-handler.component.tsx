import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { FormModel } from '@pages/send/mail';
import { cx, Divider, Icon } from '@sk-web-gui/react';
import { File } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SendType } from 'src/types';
import { ReviewRecipientListTable } from './components/review-recipients-list-table.component';
import { ReviewRecipientsTable } from './components/review-recipients-table.component';

export interface ReviewHandlerProps {
  sendType: SendType;
}

const ReviewHandler = ({ sendType }: ReviewHandlerProps) => {
  const { watch } = useFormContext<FormModel>();
  const attachments = watch('attachmentList');
  const department = watch('department');
  const subject = watch('subject');

  const contentClass = 'flex flex-col w-full gap-12';
  const { t } = useTranslation(['common', 'send-mail']);

  const attachmentsContent = (
    <div data-cy="review-attachments" className={cx(contentClass, 'mb-16')}>
      <h3 className="text-label-medium">{t('send-mail:reviewHandler.attachments')}</h3>
      {attachments.map((a, i) => {
        return (
          <React.Fragment key={`item-${a.file?.name.substring(0, 5)}-${a.file?.type}`}>
            <div className="flex items-center gap-16 p-12">
              <div className="bg-vattjom-surface-accent p-10 gap-8 rounded-utility max-w-[44px] max-h-[44px]">
                <Icon icon={<File />} />
              </div>
              {<p className="break-all font-bold">{a.file?.name}</p>}
            </div>
            {attachments.length - 1 !== i && <Divider className="w-full" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const subjectContent = (
    <div data-cy="review-subject" className="flex flex-col w-full gap-12">
      <h3 className="text-label-medium">{t('send-mail:reviewHandler.subject')}</h3>
      <p className="my-auto">{subject}</p>
    </div>
  );

  const departmentContent = (
    <div className="flex flex-col w-full gap-12">
      <h3 className="text-label-medium">{t('send-mail:reviewHandler.department')}</h3>
      <p className="my-auto">{department}</p>
    </div>
  );

  return (
    <HandlerWrapper title={t('send-mail:reviewHandler.header')}>
      <ReviewRecipientsTable sendType={sendType} className={contentClass} />
      <ReviewRecipientListTable className={contentClass} />
      {attachmentsContent}
      {subjectContent}
      {departmentContent}
    </HandlerWrapper>
  );
};

export default ReviewHandler;
