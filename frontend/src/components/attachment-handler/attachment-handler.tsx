import FileUpload from '@components/file-upload/file-upload.component';
import { Divider, FormControl } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import { all } from 'cypress/types/bluebird';

export interface Attachment {
  file: File | undefined;
  main?: boolean;
}
export interface AttachmentFormModel {
  message: string;
  attachmentList: Attachment[];
}

const AttachmentHandler: React.FC = () => {
  const maxMain = 1;
  const maxSecondary = 3;

  const { register, watch, setValue, getValues } = useFormContext<AttachmentFormModel>();

  const attachmentList = watch('attachmentList').map((attach, index) => ({ ...attach, index }));

  const handleRemove = (index: number, main?: boolean) => {
    const allFiles = getValues('attachmentList');
    if (main) {
      const newIndex = allFiles.findIndex((attach) => !attach.main);
      if (newIndex > -1) {
        allFiles[newIndex] = { ...allFiles[newIndex], main: true };
        setValue('attachmentList', allFiles);
      }
    }
    allFiles.splice(index, 1);
    setValue('attachmentList', allFiles);
  };

  const handleMain = (index: number) => {
    const allFiles = getValues('attachmentList');
    console.log('Old list: ', allFiles);
    // const oldIndex = allFiles.findIndex((attach) => attach.main);
    // allFiles[oldIndex] = { ...allFiles[oldIndex], main: false };
    // allFiles[index] = { ...allFiles[index], main: true };
    const newFiles = allFiles.toSpliced(index, 1).toSpliced(0, 0, allFiles[index]);
    console.log('New list: ', newFiles);
    setValue('attachmentList', newFiles);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards gap-32">
        <input type="hidden" {...register('message')} value="hiddenmessage" />
        <div className="w-full">
          <h4 className="px-32 py-16">Lägg till textdokument</h4>
          <Divider className="w-full" orientation="horizontal" strong={false} />
        </div>
        <FormControl id="attachment" className="w-full px-32 gap-8">
          <FileUpload
            label="Dokument"
            fieldName={'attachmentList'}
            allowMultiple={maxMain + maxSecondary > 1}
            allowMax={maxMain + maxSecondary}
            accept={['.pdf', '.PDF']}
            helperText="Maximal filstorlek: 2 MB. Tillåtna filtyper: pdf"
          />
        </FormControl>

        <div className="w-full">
          {attachmentList.length > 0 && (
            <div className="w-full px-32 gap-40">
              {/* <h4 className="pb-8">Huvuddokument</h4> */}
              {/* {attachmentList.filter((attach) => attach.main).length > 0 && (
                <div className="gap-8 pb-32" data-cy="mainAttachment">
                  {attachmentList.map((attach, index) => {
                    if (attach.main) {
                      return (
                        <FileListItemComponent
                          key={index}
                          data={attach}
                          handleRemove={handleRemove}
                          handleMain={handleMain}
                        />
                      );
                    }
                  })}
                </div>
              )} */}

              {attachmentList.length > 0 && (
                <div className="gap-8 pb-32" data-cy="attachments">
                  <h4 className="pb-8">Bifogade dokument</h4>
                  {attachmentList.map((attach, index) => {
                    // if (!attach.main) {
                    return (
                      <FileListItemComponent
                        key={index}
                        data={attach}
                        handleRemove={handleRemove}
                        handleMain={handleMain}
                      />
                    );
                    // }
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentHandler;
