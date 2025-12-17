import { Accordion, useThemeQueries } from '@sk-web-gui/react';
import { useMemo } from 'react';
import { EnumQATags } from 'src/types';
import { useHelpQA } from './useHelpQA';

interface HelpProps {
  filterTag?: EnumQATags;
  size?: 'sm' | 'md';
}

export const Help: React.FC<HelpProps> = ({ filterTag, size: _size }) => {
  const { isMinMd } = useThemeQueries();
  const qaItems = useHelpQA();

  const size = _size || (isMinMd ? 'md' : 'sm');

  const filteredQAItems = useMemo(() => {
    if (!filterTag || filterTag?.length === 0) return qaItems;
    return qaItems.filter((q) => q.tags.includes(filterTag));
  }, [filterTag, qaItems]);

  const getContent = () => {
    return (
      <>
        {filteredQAItems.map((q) => (
          <Accordion.Item headerAs="h3" header={q.question} key={q.id}>
            {q.answer}
          </Accordion.Item>
        ))}
      </>
    );
  };

  return (
    <Accordion className="w-full" size={size} allowMultipleOpen>
      {getContent()}
    </Accordion>
  );
};
