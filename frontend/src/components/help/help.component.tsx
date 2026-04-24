import { Accordion, useThemeQueries } from '@sk-web-gui/react';
import { useMemo } from 'react';
import { EnumQATags, QAItem } from 'src/types';
import { useHelpQA } from './useHelpQA';
import { useTranslation } from 'next-i18next';

interface HelpProps {
  filterTag?: EnumQATags;
  size?: 'sm' | 'md';
}

interface ISection {
  header: string;
  items: QAItem[];
}

export const Help: React.FC<HelpProps> = ({ filterTag, size: _size }) => {
  const { isMinMd } = useThemeQueries();
  const qaItems = useHelpQA();
  const { t, i18n } = useTranslation(['help-menu']);

  const size = _size || (isMinMd ? 'md' : 'sm');

  const getCategorizedItems = useMemo(
    () =>
      (qaItems: QAItem[]): ISection[] => [
        {
          header: t('help-menu:categoryHeaders.about'),
          items: qaItems.filter((q) => [1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(q.id))),
        },
        {
          header: t('help-menu:categoryHeaders.receiver'),
          items: qaItems.filter((q) => [10, 11].includes(Number(q.id))),
        },
        {
          header: t('help-menu:categoryHeaders.documents'),
          items: qaItems.filter((q) => [12, 13, 14, 15, 16, 17, 18].includes(Number(q.id))),
        },
        {
          header: t('help-menu:categoryHeaders.recommended'),
          items: qaItems.filter((q) => [19, 20, 21].includes(Number(q.id))),
        },
        { header: t('help-menu:categoryHeaders.sms'), items: qaItems.filter((q) => [22, 23, 24].includes(Number(q.id))) },
      ],
    [t, i18n.language]
  );

  const sections = useMemo(() => {
    if (!filterTag || filterTag?.length === 0) return getCategorizedItems(qaItems);
    const filtered = qaItems.filter((q) => q.tags.includes(filterTag));
    return getCategorizedItems(filtered);
  }, [filterTag, qaItems, getCategorizedItems]);

  return (
    <>
      {sections.map((section) => {
        if (section.items.length === 0) return null;
        return (
          <>
            <p className="text-h4-lg font-header m-0 mt-20 pb-3">{section.header}</p>
            <hr />
            <Accordion className="w-full" size={size} allowMultipleOpen>
              {section.items.map((q) => (
                <Accordion.Item key={q.id}>
                  <Accordion.Item.Header>
                    <Accordion.Item.Title>
                      <h3 className="text-h4-sm">{q.question}</h3>
                    </Accordion.Item.Title>
                    <Accordion.Item.Button />
                  </Accordion.Item.Header>
                  <Accordion.Item.Content>{q.answer}</Accordion.Item.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          </>
        );
      })}
    </>
  );
};
