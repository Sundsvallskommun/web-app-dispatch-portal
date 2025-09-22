import { Button, ProgressStepper, Icon, Link } from '@sk-web-gui/react';
import { ArrowRight } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

export interface FormStep {
  label: string;
  component: ReactNode;
  valid?: boolean;
}

interface FormStepperProps {
  steps: FormStep[];
  onChangeStep?: (step: number) => void;
  submitButton?: JSX.Element;
}

export const FormStepper: React.FC<FormStepperProps> = (props) => {
  const { steps, onChangeStep, submitButton } = props;
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  useEffect(() => {
    onChangeStep && onChangeStep(currentStep);
  }, [currentStep, onChangeStep]);

  return (
    <>
      <div className="flex flex-1 justify-between items-center pt-64 z-10 left-0 top-0 right-0">
        <ProgressStepper
          className="w-full max-w-[82rem]"
          steps={steps.map((step) => step.label)}
          current={currentStep}
          // rounded={true}
          size={'sm'}
        ></ProgressStepper>
      </div>
      <div className="py-32">{steps[currentStep].component}</div>
      <div className="flex flex-row justify-end gap-16">
        <div>
          {currentStep !== 0 && (
            <Button
              variant="secondary"
              onClick={() => handleChangeStep(currentStep - 1)} /* leftIcon={<ArrowLeft />} */
            >
              Tillbaka
            </Button>
          )}
        </div>
        <div>
          {currentStep === steps.length - 1 ? (
            <>{submitButton}</>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleChangeStep(currentStep + 1)}
              disabled={!steps[currentStep].valid}
              color="vattjom"
              rightIcon={<ArrowRight />}
            >
              Nästa
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
