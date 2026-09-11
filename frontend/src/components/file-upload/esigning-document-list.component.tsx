import { FileUpload, Icon, UploadFile } from '@sk-web-gui/react';
import { File, Pencil } from 'lucide-react';
import { useEsigningDocuments } from 'src/hooks/useEsigningDocuments';
import { DocumentTypeLabel } from './document-type-label.component';

export interface EsigningDocumentListProps {
  onRemove?: (file: UploadFile) => void;
}

export const EsigningDocumentList = ({ onRemove }: EsigningDocumentListProps) => {
  const { combinedDocumentList, isSignatoryDocument, fileSizeDescription } = useEsigningDocuments();

  return (
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
              showRemove: !!onRemove,
              onRemove,
              extraActions: <DocumentTypeLabel isSignatoryDocument={isSignatoryDocument(file)} />,
            }}
          />
        ))}
      </FileUpload.List>
    </div>
  );
};
