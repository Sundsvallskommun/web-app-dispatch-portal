import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormControl, Icon, ProgressBar } from '@sk-web-gui/react';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@utils/file.utils';
import { Menu } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
      <FormControl id="attachment" className="w-full pb-24">
        <FileUpload
          label="Dokument"
          fieldName={'attachmentList'}
          allowMultiple={maxMain + maxSecondary > 1}
          allowMax={maxMain + maxSecondary}
          accept={['.pdf', '.PDF']}
          helperText={t('send-mail:attachmentHandler.helperText')}
          maxFileSizeMB={MAX_ATTACHMENT_FILE_SIZE_MB}
        />
      </FormControl>
      <div className="flex flex-col gap-8 w-full">
        <p className="text-small">
          {t('send-mail:attachmentHandler.progressStepper', {
            files: fileStorageLimit.replace('.', ','),
            limit: MAX_ATTACHMENT_FILE_SIZE_MB.toString().replace('.', ','),
          })}
        </p>
        <ProgressBar steps={progressBarValues.steps} current={progressBarValues.current} />
      </div>
      <div className="w-full">
        <h3 className="text-label-medium font-sans">{t('send-mail:attachmentHandler.addedFilesHeader')}</h3>

        {attachmentList.length > 0 ? (
          <div className="w-full" data-cy="attachments">
            <p className="text-base">{`${t('send-mail:attachmentHandler.sort')}.`}</p>
            <div className="flex flex-col gap-12" data-cy="file-list">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={attachmentList.map((item) => item.index)}
                  strategy={verticalListSortingStrategy}
                >
                  {attachmentList.map((attach) => (
                    <SortableItem key={attach.index} id={attach.index} attach={attach} handleRemove={handleRemove} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        ) : (
          <p className="text-secondary">{`${t('send-mail:attachmentHandler:noFiles')}`}</p>
        )}
      </div>
    </HandlerWrapper>
  );
};

const SortableItem: React.FC<{
  id: number;
  attach: Attachment;
  handleRemove: (index: number) => void;
}> = ({ id, attach, handleRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="flex gap-16 items-center" ref={setNodeRef} style={style} {...attributes}>
      <span className="text-base text-body drag-handler cursor-grab">{id + 1}</span>
      <div className="flex flex-1 items-center rounded-groups border-1">
        <div className="py-24 px-22 border-r-1 content-center" {...listeners}>
          <Icon icon={<Menu />} />
        </div>
        <FileListItemComponent data={attach} handleRemove={() => handleRemove(id)} noBorder={true} />
      </div>
    </div>
  );
};

export default AttachmentHandler;
