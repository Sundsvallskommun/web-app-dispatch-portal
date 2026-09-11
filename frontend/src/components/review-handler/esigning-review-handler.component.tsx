import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { SignatoryTable } from '@components/signatory-table/signatory-table.component';
import { EsigningDocumentList } from '@components/file-upload/esigning-document-list.component';
import { useEsigningDocuments } from 'src/hooks/useEsigningDocuments';

const EsigningReviewHandler = () => {
  const { t } = useTranslation(['send-esigning', 'common']);
  const { watch } = useFormContext<SendEsigningForm>();

  const subject = watch('subject');

  const { combinedDocumentList } = useEsigningDocuments();

  const subjectContent = (
    <div data-cy="review-subject" className="flex flex-col w-full gap-12">
      <h3 className="text-label-medium">{t('send-esigning:reviewHandler.subject')}</h3>
      <p className="my-auto">{subject}</p>
    </div>
  );

  return (
    <div className="w-full flex justify-center">
      <HandlerWrapper
        title={t('send-esigning:reviewHandler.title')}
        description={t('send-esigning:reviewHandler.description')}
      >
        <div className="w-full flex flex-col gap-8">
          <h3 className="text-label-medium">{t('send-esigning:reviewHandler.signatories')}</h3>
          <SignatoryTable />
        </div>

        {subjectContent}

        {combinedDocumentList.length > 0 && (
          <div className="w-full flex flex-col gap-8">
            <h3 className="text-label-medium">{t('send-esigning:reviewHandler.attachments')}</h3>
            <EsigningDocumentList />
          </div>
        )}
      </HandlerWrapper>
    </div>
  );
};

export default EsigningReviewHandler;
