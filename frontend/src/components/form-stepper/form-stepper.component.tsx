import React, { ReactNode, useEffect, useState } from 'react';
import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, cx, ProgressStepper } from '@sk-web-gui/react';
import { ArrowRight } from 'lucide-react';
import { useWindowSize } from 'src/hooks/useWindowSize';
import { formSendType, tailwindBreakPoint } from 'src/constants';
import SuccessContainer from '@components/success-container/success-container';
import { SendType } from 'src/types';

export interface FormStep {
  label: string;
  component: ReactNode;
  valid?: boolean;
  onNextClick?: (currentStep: number) => Promise<boolean>;
}

interface FormStepperProps<T extends FieldValues> {
  steps: FormStep[];
  onChangeStep?: (step: number) => void;
  submitButton?: JSX.Element;
  getScreenReaderStepperText: () => string | undefined;
  controls: UseFormReturn<T>;
  success: boolean;
  onResetSuccess: () => void;
  sendType?: SendType;
}

const FormStepper = <T extends FieldValues>({
  steps,
  onChangeStep,
  submitButton,
  getScreenReaderStepperText,
  controls,
  success,
  onResetSuccess,
  sendType = formSendType.MAIL,
}: FormStepperProps<T>) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { t } = useTranslation(['common', 'send-mail']);
  const { width } = useWindowSize();
  const isMd = width < tailwindBreakPoint.MD;
  const i18nSendType = `send-mail:success.${sendType === formSendType.MAIL ? 'mail' : 'rekMail'}`;

  useEffect(() => {
    onChangeStep && onChangeStep(currentStep);
  }, [currentStep, onChangeStep]);

  const handleNextClicked = async () => {
    let canProceed = true;

    if (steps[currentStep].onNextClick) {
      canProceed = await steps[currentStep].onNextClick(currentStep);
    }

    if (canProceed && steps[currentStep].valid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleOnResetSuccess = () => {
    setCurrentStep(0);
    onResetSuccess();
  };

  const contentFormProvider = (
    <FormProvider {...controls}>
      <ProgressStepper
        className={cx(isMd ? 'pt-16 pb-16' : 'pt-64 pb-40')}
        size="sm"
        labelPosition="right"
        steps={steps.map((s) => {
          return s.label;
        })}
        current={currentStep}
        vertical={isMd}
      />
      {steps[currentStep].component}
      <div className="flex flex-row justify-end gap-16 my-40">
        {currentStep !== 0 && (
          <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)}>
            {t('back')}
          </Button>
        )}
        <div>
          {currentStep === steps.length - 1 ? (
            submitButton
          ) : (
            <Button
              data-cy="next-button"
              variant="primary"
              onClick={() => handleNextClicked()}
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
    <React.Fragment>
      <h1 className="sr-only">{`${t('screenReader.sendPost')}. ${getScreenReaderStepperText()}`}</h1>
      <div className={cx('flex flex-col', isMd ? '' : 'max-w-[--w-max-stepper-content] w-[--w-stepper-content]')}>
        {success ? (
          <SuccessContainer
            onClick={handleOnResetSuccess}
            title={t(`${i18nSendType}.header`)}
            message={t(`${i18nSendType}.description`)}
            sendNewBtntext={t(`${i18nSendType}.buttonMsg`)}
          />
        ) : (
          contentFormProvider
        )}
      </div>
    </React.Fragment>
  );
};

export default FormStepper;
