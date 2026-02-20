import { JSX, useMemo } from 'react';
import { cx, Link, List } from '@sk-web-gui/react';
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
      <p
        key={`helpparagraph-${id}-${index}`}
        className={cx(index > 0 ? 'mt-8 leading-normal' : 'leading-normal', 'text-justify [hyphens:auto]')}
      >
        {paragraph}
      </p>
    ));

  const itemsFactory = (ids: number[], tags: EnumQATags[], components?: { [key: string]: JSX.Element }) => {
    if (components) {
      return ids.map((i) => ({
        id: String(i),
        question: t(`help-menu:questionsAndAnswers.${i}.question`),
        answer: <Trans i18nKey={`help-menu:questionsAndAnswers.${i}.answer`} components={components} />,
        tags,
      }));
    }
    return ids.map((i) => ({
      id: String(i),
      question: t(`help-menu:questionsAndAnswers.${i}.question`),
      answer: splitInParagraphs(t(`help-menu:questionsAndAnswers.${i}.answer`), String(i)),
      tags,
    }));
  };

  const items = useMemo(
    () =>
      [
        ...itemsFactory([27, 28], [EnumQATags.SMS]),
        ...itemsFactory([12, 13, 14], [EnumQATags.MAIL]),
        ...itemsFactory([18], [EnumQATags.MAIL], {
          p: <p className="mt-4 text-justify [hyphens:auto]" />,
          a: <Link href="/files/example.csv" />,
        }),
        ...itemsFactory([2, 3, 4, 5, 7, 8, 9, 10, 16, 17, 19, 20, 24, 25, 26], [EnumQATags.MAIL, EnumQATags.REK_MAIL]),
        ...itemsFactory([6], [EnumQATags.MAIL, EnumQATags.REK_MAIL], {
          p: <p className="mt-4 text-justify [hyphens:auto]" />,
          List: <List listStyle="bullet" />,
          ListItem: <List.Item />,
          ListText: <List.Text />,
        }),
        ...itemsFactory([21, 22], [EnumQATags.MAIL, EnumQATags.REK_MAIL], {
          p: <p className="mt-4 text-justify [hyphens:auto]" />,
        }),
        ...itemsFactory([23], [EnumQATags.MAIL, EnumQATags.REK_MAIL], {
          p: <p className="mt-4 text-justify [hyphens:auto]" />,
          strong: <strong />,
          a: (
            <a className="text-vattjom-text-primary underline" href="mailto:support@sundsvall.se">
              {/* translation will inject text here */}
            </a>
          ),
        }),
        ...itemsFactory([1], [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL]),
      ].sort((a, b) => Number(a.id) - Number(b.id)),
    [i18n.language]
  );

  return items;
};
