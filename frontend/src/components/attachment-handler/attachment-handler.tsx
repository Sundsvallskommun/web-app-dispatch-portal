import { useEffect, useMemo, useState } from 'react';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@services/message-service';
import { FormControl, Icon, ProgressBar } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';

export interface Attachment {
  file: File | undefined;
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
  const [resetErrorTrigger, setResetErrorTrigger] = useState(0);
  const { t } = useTranslation(['send-mail']);

  useEffect(() => {
    setValue('attachmentList', []);
  }, [setValue]);

  const fileStorageLimit = useMemo(() => {
    const totalBytes = attachmentList.reduce((sum, a) => sum + (a.file?.size || 0), 0);
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [attachmentList]);

  const progressBarValues = {
    steps: MAX_ATTACHMENT_FILE_SIZE_MB * 10,
    current: Number(fileStorageLimit) * 10,
  };

  const handleErrorTrigger = () => {
    setResetErrorTrigger((prev) => prev + 1);
  };

  const handleRemove = (index: number) => {
    const allFiles = getValues('attachmentList');
    allFiles.splice(index, 1);
    setValue('attachmentList', allFiles);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = attachmentList.findIndex((item) => item.index === active.id);
      const newIndex = attachmentList.findIndex((item) => item.index === over.id);

      const reorderedList = arrayMove(attachmentList, oldIndex, newIndex);
      setValue(
        'attachmentList',
        reorderedList.map((item) => ({ ...item, index: item.index }))
      );
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  return (
    <HandlerWrapper
      title={t('send-mail:attachmentHandler.header')}
      description={t('send-mail:attachmentHandler.description')}
    >
      <input type="hidden" {...register('message')} value="hiddenmessage" />
      <FormControl id="attachment" className="w-full gap-8">
        <FileUpload
          label="Dokument"
          fieldName={'attachmentList'}
          allowMultiple={maxMain + maxSecondary > 1}
          allowMax={maxMain + maxSecondary}
          accept={['.pdf', '.PDF']}
          helperText={t('send-mail:attachmentHandler.helperText')}
          maxFileSizeMB={MAX_ATTACHMENT_FILE_SIZE_MB}
          resetErrorTrigger={resetErrorTrigger}
        />
      </FormControl>
      <div className="flex flex-col gap-8 w-full">
        <p className="text-small">
          {t('send-mail:attachmentHandler.progressStepper', {
            files: fileStorageLimit,
            limit: MAX_ATTACHMENT_FILE_SIZE_MB,
          })}
        </p>
        <ProgressBar steps={progressBarValues.steps} current={progressBarValues.current} />
      </div>
      <div className="w-full">
        {attachmentList.length === 0 && (
          <div>
            <h3 className="text-label-medium">{t('send-mail:attachmentHandler.addedFilesHeader')}</h3>
            <p className="text-base">{`${t('send-mail:attachmentHandler:noFiles')}.`}</p>
          </div>
        )}
        {attachmentList.length > 0 && (
          <div className="w-full">
            <h4 className="pb-8 text-label-medium">
              {t('send-mail:attachmentHandler.addedFiles', { num: attachmentList.length })}
            </h4>
            <p className="text-base">{`${t('send-mail:attachmentHandler.sort')}.`}</p>
            <div className="flex flex-col gap-12">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={attachmentList.map((item) => item.index)}
                  strategy={verticalListSortingStrategy}
                >
                  {attachmentList.map((attach) => (
                    <SortableItem
                      key={attach.index}
                      id={attach.index}
                      attach={attach}
                      handleRemove={handleRemove}
                      callback={handleErrorTrigger}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}
      </div>
    </HandlerWrapper>
  );
};

const SortableItem: React.FC<{
  id: number;
  attach: Attachment;
  handleRemove: (index: number) => void;
  callback: () => void;
}> = ({ id, attach, handleRemove, callback }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleErrorTriggerCallback = () => {
    callback();
  };

  return (
    <div className="flex gap-16 items-center" ref={setNodeRef} style={style} {...attributes}>
      <span className="text-base text-body drag-handler cursor-grab">{id + 1}</span>

      <div className="flex flex-1 items-center rounded-groups border-1">
        <div className="py-24 px-22 border-r-1 content-center" {...listeners}>
          <Icon size="1.4rem" icon={<Menu />} />
        </div>
        <FileListItemComponent
          data={attach}
          callback={handleErrorTriggerCallback}
          handleRemove={() => handleRemove(id)}
          noBorder={true}
        />
      </div>
    </div>
  );
};

export default AttachmentHandler;
