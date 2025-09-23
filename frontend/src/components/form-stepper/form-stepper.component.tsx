import { Button, Icon, ProgressStepper } from '@sk-web-gui/react';
import { ArrowRight, BadgeCheck, MailCheck } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import FormStepperHeader from './form-stepper-header.component';
import { useTranslation } from 'react-i18next';

export interface FormStep {
  label: string;
  component: ReactNode;
  valid?: boolean;
  onNextClick?: () => void;
}

interface FormStepperProps<T extends FieldValues> {
  steps: FormStep[];
  onChangeStep?: (step: number) => void;
  submitButton?: JSX.Element;
  getScreenReaderStepperText: () => string | undefined;
  controls: UseFormReturn<T>;
  headerTitle: string;
  success: boolean;
  onResetSuccess: () => void;
}

const FormStepper = <T extends FieldValues>({
  steps,
  onChangeStep,
  submitButton,
  getScreenReaderStepperText,
  controls,
  headerTitle,
  success,
  onResetSuccess,
}: FormStepperProps<T>) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { t } = useTranslation(['common', 'send-mail']);

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  useEffect(() => {
    onChangeStep && onChangeStep(currentStep);
  }, [currentStep, onChangeStep]);

  const contentSuccess = (
    <div className="text-center max-w-[63rem] mx-auto">
      <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
      <h2 className="mt-24">{t('send-mail:success')}</h2>
      <p className="my-md text-base">{`${t('send-mail:successInfo')}`}</p>
      <div className="flex gap-16 justify-center mt-40">
        <Button className="mt-lg" color="primary" variant="secondary" onClick={onResetSuccess}>
          {t('send-mail:sendNew')}
        </Button>
        <NextLink href="/" passHref legacyBehavior>
          <Button className="mt-lg" color="vattjom">
            {t('send-mail:goBack')}
          </Button>
        </NextLink>
      </div>
    </div>
  );

  const contentFormProvider = (
    <FormProvider {...controls}>
      <div className="flex flex-1 justify-between items-center pt-64 z-10 left-0 top-0 right-0">
        <ProgressStepper
          className="w-full max-w-[82rem]"
          steps={steps.map((step) => step.label)}
          current={currentStep}
          rounded={true}
          size={'sm'}
        ></ProgressStepper>
      </div>
      <div className="py-32">{steps[currentStep].component}</div>
      <div className="flex flex-row justify-end gap-16">
        <div>
          {currentStep !== 0 && (
            <Button variant="secondary" onClick={() => handleChangeStep(currentStep - 1)}>
              {t('back')}
            </Button>
          )}
        </div>
        <div>
          {currentStep === steps.length - 1 ? (
            submitButton
          ) : (
            <Button
              variant="primary"
              onClick={() => handleChangeStep(currentStep + 1)}
              disabled={!steps[currentStep].valid}
              color="vattjom"
              rightIcon={<ArrowRight />}
            >
              {t('next')}
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );

  return (
    <div className="flex items-center flex-col">
      <FormStepperHeader title={headerTitle} icon={<MailCheck />} />
      <h1 className="sr-only">{`${t('screenReader.sendPost')}. ${getScreenReaderStepperText()}`}</h1>
      <div className="flex flex-col max-w-[--w-max-stepper-content] w-[--w-stepper-content]">
        {success ? contentSuccess : contentFormProvider}
      </div>
    </div>
  );
};

export default FormStepper;
