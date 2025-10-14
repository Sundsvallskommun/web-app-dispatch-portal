import { FormErrorMessage, Icon } from '@sk-web-gui/react';
import { Info } from 'lucide-react';

interface FileUploadErrorProps {
  id: number;
  message: string | undefined;
}

const FileUploadError = ({ id, message }: FileUploadErrorProps) => {
  return (
    <FormErrorMessage key={`fileError-${id}`} className="flex items-center gap-8 mt-8">
      <Icon size={16} icon={<Info />} color="error" />
      <p className="text-error">{message}</p>
    </FormErrorMessage>
  );
};

export default FileUploadError;
