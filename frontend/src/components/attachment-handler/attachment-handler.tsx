import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import FileUpload from '@components/file-upload/file-upload.component';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@services/message-service';
import { Divider, FormControl, Icon } from '@sk-web-gui/react';
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
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards gap-56 p-32">
        <input type="hidden" {...register('message')} value="hiddenmessage" />
        <div className="w-full">
          <h4 className="pb-6">{t('send-mail:attachmentHandler.header')}</h4>
          <p className="text-base pb-6">{t('send-mail:attachmentHandler.description')}</p>
          <Divider className="w-full" orientation="horizontal" strong={false} />
        </div>
        <FormControl id="attachment" className="w-full gap-8">
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
                      <SortableItem key={attach.index} id={attach.index} attach={attach} handleRemove={handleRemove} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
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
          <Icon size="1.4rem" icon={<Menu />} />
        </div>
        <FileListItemComponent data={attach} handleRemove={() => handleRemove(id)} noBorder={true} />
      </div>
    </div>
  );
};

export default AttachmentHandler;
