import React from 'react';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { FormModel } from '@pages/send/mail';
import { useMessageStore } from '@services/recipient-service';
import { AutoTable, AutoTableHeader, cx, Divider, Icon, Label } from '@sk-web-gui/react';
import { File } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { SendType } from 'src/types';
import { formatPersonNumber } from '@utils/helpers';
import { createDeliveryMethodMap } from '@utils/helpers';

interface ReviewHandlerProps {
  sendType: SendType;
}

const ReviewHandler = ({ sendType }: ReviewHandlerProps) => {
  const { watch } = useFormContext<FormModel>();
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const attachments = watch('attachmentList');
  const department = watch('department');
  const subject = watch('subject');
  const validRecipients = recipients.filter((rec) => !rec?.error);
  const combinedLength = validRecipients.length + addresses.length;
  const contentClass = 'flex flex-col w-full gap-12';
  const { t } = useTranslation(['common', 'send-mail']);

  const columnRecipent: AutoTableHeader = {
    label: t('send-mail:reviewHandler.recipients'),
    isColumnSortable: false,
    renderColumn: (_value, item) => {
      const formatedPersonnummer = formatPersonNumber(item?.address?.personNumber);
      if (sendType === formSendType.REK_MAIL) {
        return (
          <p className="flex flex-col">
            <span>{`${item?.address?.givenname} ${item?.address?.lastname}, ${formatedPersonnummer}`}</span>
          </p>
        );
      } else {
        return (
          <p className="flex flex-col">
            <span>{`${item?.address?.givenname} ${item?.address?.lastname}`}</span>
            <span>{formatedPersonnummer}</span>
          </p>
        );
      }
    },
  };

  const columnAddress: AutoTableHeader = {
    label: t('send-mail:reviewHandler.address'),
    isColumnSortable: false,
    renderColumn: (_value, item) => {
      return (
        <p className="flex flex-col">
          <span>{item?.address?.addresses[0].address},</span>
          <span>{[item?.address?.addresses[0].postalCode, item?.address?.addresses[0].city].join(' ')}</span>
        </p>
      );
    },
  };

  const columnDeliveryMethod: AutoTableHeader = {
    label: t('send-mail:reviewHandler.deliveryMethod'),
    isColumnSortable: false,
    renderColumn: (_value, item) => {
      const deliveryMethodMap = createDeliveryMethodMap(t('send-mail:mail'), t('send-mail:digital'));
      const deliveryMethodColorMap = createDeliveryMethodMap('tertiary', 'vattjom');

      const deliveryMethod = item?.address?.deliveryMethod;

      return (
        <Label rounded={true} color={deliveryMethodColorMap[deliveryMethod]} inverted={true}>
          {deliveryMethodMap[deliveryMethod]}
        </Label>
      );
    },
  };

  const columnsWithHeaders: AutoTableHeader[] =
    sendType === formSendType.MAIL ? [columnRecipent, columnAddress, columnDeliveryMethod] : [columnRecipent];

  const recipentsTable = (
    <div className={cx(contentClass, 'mb-16')}>
      <h3 className="text-label-medium">
        {t('send-mail:reviewHandler.recipients')} {sendType === formSendType.MAIL && `(${combinedLength})`}
      </h3>
      <AutoTable
        footer={combinedLength >= 12}
        pageSize={11}
        autodata={[...validRecipients, ...addresses]}
        autoheaders={[...columnsWithHeaders]}
      />
    </div>
  );

  const attachmentsContent = (
    <div className={cx(contentClass, 'mb-16')}>
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
    <div className="flex flex-col w-full gap-12">
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
      {recipentsTable}
      {attachmentsContent}
      {subjectContent}
      {departmentContent}
    </HandlerWrapper>
  );
};

export default ReviewHandler;
