import { useMemo } from 'react';
import { Link, List } from '@sk-web-gui/react';
import { Trans, useTranslation } from 'next-i18next';
import { EnumQATags, QAItem } from 'src/types';

/**
 * Hook that provides a sorted array of help Q&A items with translations and tags.
 *
 * The returned array is sorted in **ascending** order by ID (numerically from lowest to highest).
 *
 * @returns {QAItem[]} An array of Q&A items, each containing:
 *   - `id`: Unique identifier for the question
 *   - `question`: Translated question text
 *   - `answer`: Formatted answer content (paragraphs, lists, or rich text with links)
 *   - `tags`: Array of category tags (SMS, MAIL, REK_MAIL, etc.)
 *
 * @example
 * const qaItems = useHelpQA();
 * // Returns items sorted by ID: [1, 2, 3, ..., 27, 28]
 */
export const useHelpQA = (): QAItem[] => {
  const { t, i18n } = useTranslation(['help-menu']);

  const splitInParagraphs = (text: string, id: string) =>
    text.split('\n').map((paragraph, index) => (
      <p key={`helpparagraph-${id}-${index}`} className={index > 0 ? 'mt-4 leading-normal' : 'leading-normal'}>
        {paragraph}
      </p>
    ));

  const items = useMemo(
    () =>
      [
        ...[27, 28].map((i) => ({
          id: String(i),
          question: t(`help-menu:questionsAndAnswers.${i}.question`),
          answer: splitInParagraphs(t(`help-menu:questionsAndAnswers.${i}.answer`), String(i)),
          tags: [EnumQATags.SMS],
        })),
        ...[12, 13, 14, 15].map((i) => ({
          id: String(i),
          question: t(`help-menu:questionsAndAnswers.${i}.question`),
          answer: splitInParagraphs(t(`help-menu:questionsAndAnswers.${i}.answer`), String(i)),
          tags: [EnumQATags.MAIL],
        })),
        {
          id: '18',
          question: t('help-menu:questionsAndAnswers.18.question'),
          answer: (
            <Trans
              i18nKey="help-menu:questionsAndAnswers.18.answer"
              components={{
                p: <p />,
                a: <Link href="/files/example.csv" />,
              }}
            />
          ),
          tags: [EnumQATags.MAIL],
        },
        ...[2, 3, 4, 5, 7, 8, 9, 10, 11, 16, 17, 19, 20, 24, 25, 26].map((i) => ({
          id: String(i),
          question: t(`help-menu:questionsAndAnswers.${i}.question`),
          answer: splitInParagraphs(t(`help-menu:questionsAndAnswers.${i}.answer`), String(i)),
          tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
        })),
        {
          id: '6',
          question: t('help-menu:questionsAndAnswers.6.question'),
          answer: (
            <>
              {splitInParagraphs(t('help-menu:questionsAndAnswers.6.answer'), '6')}
              <List listStyle="bullet">
                {[1, 3, 4, 5, 6].map((i) => (
                  <List.Item key={i}>
                    <List.Text>{t(`help-menu:questionsAndAnswers.6.listItems.${i}`)} </List.Text>
                  </List.Item>
                ))}
              </List>
            </>
          ),
          tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
        },

        {
          id: '21',
          question: t('help-menu:questionsAndAnswers.21.question'),
          answer: (
            <Trans
              i18nKey="help-menu:questionsAndAnswers.21.answer"
              components={{
                p: <p />,
              }}
            />
          ),
          tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
        },
        {
          id: '22',
          question: t('help-menu:questionsAndAnswers.22.question'),
          answer: (
            <Trans
              i18nKey={'help-menu:questionsAndAnswers.22.answer'}
              components={{
                p: <p />,
              }}
            />
          ),
          tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
        },
        {
          id: '23',
          question: t('help-menu:questionsAndAnswers.23.question'),
          answer: (
            <Trans
              i18nKey="help-menu:questionsAndAnswers.23.answer"
              components={{
                p: <p />,
                strong: <strong />,
                a: (
                  <a className="text-vattjom-text-primary underline" href="mailto:support@sundsvall.se">
                    {/* translation will inject text here */}
                  </a>
                ),
              }}
            />
          ),
          tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
        },
        {
          id: '1',
          question: t('help-menu:questionsAndAnswers.1.question'),
          answer: splitInParagraphs(t('help-menu:questionsAndAnswers.1.answer'), '1'),
          tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
        },
      ].sort((a, b) => Number(a.id) - Number(b.id)),
    [i18n.language]
  );

  return items;
};
