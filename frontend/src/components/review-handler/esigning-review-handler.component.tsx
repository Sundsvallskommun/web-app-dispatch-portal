import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { AutoTable, AutoTableHeader, FileUpload, Icon } from '@sk-web-gui/react';
import { File, Pencil } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { formatLegalId } from '@utils/helpers';
import { Signatory } from '@components/recipient-handler/esigning-recipient-handler';
import { DocumentTypeLabel } from '@components/file-upload/document-type-label.component';
import { useEsigningDocuments } from 'src/hooks/useEsigningDocuments';

const EsigningReviewHandler = () => {
  const { t } = useTranslation(['send-esigning', 'common']);
  const { watch } = useFormContext<SendEsigningForm>();

  const signatories = watch('signatories') ?? [];
  const subject = watch('subject');

  const { combinedDocumentList, isSignatoryDocument, fileSizeDescription } = useEsigningDocuments();

  const subjectContent = (
    <div data-cy="review-subject" className="flex flex-col w-full gap-12">
      <h3 className="text-label-medium">{t('send-esigning:reviewHandler.subject')}</h3>
      <p className="my-auto">{subject}</p>
    </div>
  );

  const headers: Array<AutoTableHeader> = [
    {
      label: t('send-esigning:recipientHandler.recipients'),
      isColumnSortable: false,
      renderColumn: (_value, item) => {
        const signatory = item as Signatory;
        return (
          <div data-cy="signatory">
            <p data-cy="signatory-name">{signatory.name}</p>
            {signatory.personNumber && <p data-cy="signatory-person-number">{formatLegalId(signatory.personNumber)}</p>}
          </div>
        );
      },
    },
    {
      label: t('send-esigning:recipientHandler.emailLabel'),
      isColumnSortable: false,
      renderColumn: (_value, item) => <span data-cy="signatory-email">{(item as Signatory).email}</span>,
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <HandlerWrapper
        title={t('send-esigning:reviewHandler.title')}
        description={t('send-esigning:reviewHandler.description')}
      >
        <div className="w-full flex flex-col gap-8">
          <h3 className="text-label-medium">{t('send-esigning:reviewHandler.signatories')}</h3>
          <AutoTable
            data-cy="signatory-table"
            autodata={signatories}
            autoheaders={headers}
            pageSize={signatories.length || 1}
            footer={false}
            tableSortable={false}
          />
        </div>

        {subjectContent}

        {combinedDocumentList.length > 0 && (
          <div className="w-full flex flex-col gap-8">
            <h3 className="text-label-medium">{t('send-esigning:reviewHandler.attachments')}</h3>
            <div data-cy="combined-document-list">
              <FileUpload.List files={combinedDocumentList} showIcon={true}>
                {combinedDocumentList.map((file, index) => (
                  <FileUpload.ListItem
                    key={file.id}
                    index={index}
                    file={file}
                    iconProps={{ icon: <Icon icon={isSignatoryDocument(file) ? <Pencil /> : <File />} /> }}
                    nameProps={{ description: fileSizeDescription(file) }}
                    actionsProps={{
                      showRemove: false,
                      extraActions: <DocumentTypeLabel isSignatoryDocument={isSignatoryDocument(file)} />,
                    }}
                  />
                ))}
              </FileUpload.List>
            </div>
          </div>
        )}
      </HandlerWrapper>
    </div>
  );
};

export default EsigningReviewHandler;
