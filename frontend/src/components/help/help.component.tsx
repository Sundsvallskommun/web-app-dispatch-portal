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

  return (
    <Accordion className="w-full" size={size} allowMultipleOpen>
      {filteredQAItems.map((q) => (
        <Accordion.Item key={q.id}>
          <Accordion.Item.Header>
            <Accordion.Item.Title>
              <h3 className="text-h4-sm">{q.question}</h3>
            </Accordion.Item.Title>
            <Accordion.Item.Button />
          </Accordion.Item.Header>
          <Accordion.Item.Content>
            <p>{q.answer}</p>
          </Accordion.Item.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
