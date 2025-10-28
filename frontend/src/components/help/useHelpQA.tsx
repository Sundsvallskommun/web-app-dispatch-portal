import { Link, List } from '@sk-web-gui/react';
import { EnumQATags, QAItem } from './help-types';
import { Trans, useTranslation } from 'next-i18next';

export const useHelpQA = (): QAItem[] => {
  const { t } = useTranslation(['help-menu']);

  const splitInParagraphs = (text: string) =>
    text.split('\n').map((paragraph, i) => (
      <p key={i} className={i > 0 ? 'mt-4 leading-normal' : 'leading-normal'}>
        {paragraph}
      </p>
    ));

  return [
    {
      id: '1',
      question: t('help-menu:questionsAndAnswers.1.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.1.answer')),
      tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '2',
      question: t('help-menu:questionsAndAnswers.2.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.2.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '3',
      question: t('help-menu:questionsAndAnswers.3.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.3.answer')),
      tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '4',
      question: t('help-menu:questionsAndAnswers.4.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.4.answer')),
      tags: [EnumQATags.SMS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '5',
      question: t('help-menu:questionsAndAnswers.5.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.5.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '6',
      question: t('help-menu:questionsAndAnswers.6.question'),
      answer: (
        <>
          {splitInParagraphs(t('help-menu:questionsAndAnswers.6.answer'))}
          <List listStyle="bullet">
            {[1, 3, 4, 5, 6].map((i) => (
              <List.Item key={i}>
                <List.Text>{t(`help-menu:questionsAndAnswers.6.listItems.${i}`)} </List.Text>
              </List.Item>
            ))}
          </List>
        </>
      ),
      tags: [EnumQATags.DOCUMENTS],
    },
    {
      id: '7',
      question: t('help-menu:questionsAndAnswers.7.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.7.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '8',
      question: t('help-menu:questionsAndAnswers.8.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.8.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '9',
      question: t('help-menu:questionsAndAnswers.9.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.9.answer')),
      tags: [EnumQATags.REK_MAIL, EnumQATags.MAIL],
    },
    {
      id: '10',
      question: t('help-menu:questionsAndAnswers.10.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.10.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '11',
      question: t('help-menu:questionsAndAnswers.11.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.11.answer')),
      tags: [EnumQATags.REK_MAIL, EnumQATags.MAIL],
    },
    {
      id: '12',
      question: t('help-menu:questionsAndAnswers.12.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.12.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '13',
      question: t('help-menu:questionsAndAnswers.13.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.13.answer')),
      tags: [EnumQATags.REK_MAIL, EnumQATags.MAIL],
    },
    {
      id: '14',
      question: t('help-menu:questionsAndAnswers.14.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.14.answer')),
      tags: [EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '15',
      question: t('help-menu:questionsAndAnswers.15.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.15.answer')),
      tags: [EnumQATags.REK_MAIL],
    },
    {
      id: '16',
      question: t('help-menu:questionsAndAnswers.16.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.16.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '17',
      question: t('help-menu:questionsAndAnswers.17.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.17.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
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
      tags: [EnumQATags.RECIPIENTS, EnumQATags.MAIL],
    },
    {
      id: '19',
      question: t('help-menu:questionsAndAnswers.19.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.19.answer')),
      tags: [EnumQATags.SENDER, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '20',
      question: t('help-menu:questionsAndAnswers.20.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.20.answer')),
      tags: [EnumQATags.SENDER, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '21',
      question: t('help-menu:questionsAndAnswers.21.question'),
      answer: (
        <Trans
          i18nKey="help-menu:questionsAndAnswers.21.answer"
          components={{
            p: <p />,
            a: <Link href="/help" passHref legacyBehavior />,
          }}
        />
      ),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '22',
      question: t('help-menu:questionsAndAnswers.22.question'),
      answer: (
        <Trans
          i18nKey={'help-menu:questionsAndAnswers.22.answer'}
          components={{
            p: <p />,
            a: <Link href="/help" passHref legacyBehavior />,
          }}
        />
      ),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
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
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '24',
      question: t('help-menu:questionsAndAnswers.24.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.24.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '25',
      question: t('help-menu:questionsAndAnswers.25.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.25.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '26',
      question: t('help-menu:questionsAndAnswers.26.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.26.answer')),
      tags: [EnumQATags.DOCUMENTS, EnumQATags.MAIL, EnumQATags.REK_MAIL],
    },
    {
      id: '27',
      question: t('help-menu:questionsAndAnswers.27.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.27.answer')),
      tags: [EnumQATags.SMS],
    },
    {
      id: '28',
      question: t('help-menu:questionsAndAnswers.28.question'),
      answer: splitInParagraphs(t('help-menu:questionsAndAnswers.28.answer')),
      tags: [EnumQATags.SMS],
    },
  ];
};
