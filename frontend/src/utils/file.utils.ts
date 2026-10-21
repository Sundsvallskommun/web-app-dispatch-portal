export const MAX_ATTACHMENT_FILE_SIZE_MB = 1.5;
export const MAX_ESIGNING_FILE_SIZE_MB = 2;

export const toFileSizeParts = (bytes = 0) => {
  const kilobytes = bytes / 1024;

  return kilobytes >= 1000
    ? { size: kilobytes / 1024, unit: 'mb' as const }
    : { size: kilobytes, unit: 'kb' as const };
};

export interface FileInfo {
  name: string;
  extension: string;
  mimeType: string;
  file: string;
}

export const toBase64: (file: File) => Promise<string> = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const file2blob = async (fileItem: File) => {
  const fileData = await toBase64(fileItem);
  const attachment: FileInfo = {
    name: fileItem.name,
    extension: fileItem.name.split('.').pop() || '',
    mimeType: fileItem.type,
    file: fileData.split(',')[1],
  };
  const buf = Buffer.from(attachment.file, 'base64');
  const blob = new Blob([new Uint8Array(buf)], { type: attachment.mimeType });
  return { attachment, blob };
};
