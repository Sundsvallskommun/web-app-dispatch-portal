import { FileUpload, Icon, Label, UploadFile } from '@sk-web-gui/react';
import { File, Pencil } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useEsigningDocuments } from 'src/hooks/useEsigningDocuments';

export interface EsigningDocumentListProps {
  onRemove?: (file: UploadFile) => void;
}

export const EsigningDocumentList = ({ onRemove }: EsigningDocumentListProps) => {
  const { t } = useTranslation(['send-esigning']);
  const { combinedDocumentList, isSignatoryDocument, fileSizeDescription } = useEsigningDocuments();

  return (
    <div data-cy="combined-document-list">
      <FileUpload.List files={combinedDocumentList} showIcon={true}>
        {combinedDocumentList.map((file, index) => {
          const isSignatory = isSignatoryDocument(file);

          return (
            <FileUpload.ListItem
              key={file.id}
              index={index}
              file={file}
              iconProps={{ icon: <Icon icon={isSignatory ? <Pencil /> : <File />} /> }}
              nameProps={{ description: fileSizeDescription(file) }}
              actionsProps={{
                showRemove: !!onRemove,
                onRemove,
                extraActions: (
                  <Label
                    data-cy="document-type-label"
                    className="order-1"
                    rounded
                    inverted
                    color={isSignatory ? 'gronsta' : 'vattjom'}
                  >
                    {t(
                      isSignatory
                        ? 'send-esigning:attachmentHandler.signingLabel'
                        : 'send-esigning:attachmentHandler.attachmentLabel'
                    )}
                  </Label>
                ),
              }}
            />
          );
        })}
      </FileUpload.List>
    </div>
  );
};
