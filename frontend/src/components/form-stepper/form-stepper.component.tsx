import { Button, ProgressStepper, Icon, Link } from '@sk-web-gui/react';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { HelpComposer } from '@components/help/help-composer';

export interface FormStep {
  label: string;
  component: ReactNode;
  valid?: boolean;
  onNextClick?: (currentStep: number) => void;
}

interface FormStepperProps {
  steps: FormStep[];
  onChangeStep?: (step: number) => void;
  submitButton?: JSX.Element;
}

export const FormStepper: React.FC<FormStepperProps> = (props) => {
  const { steps, onChangeStep, submitButton } = props;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showHelpComposer, setShowHelpComposer] = useState(false);

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

  const handleNextClicked = () => {
    steps[currentStep].onNextClick?.(currentStep);

    if (steps[currentStep].valid) {
      setCurrentStep(currentStep + 1);
    }
  };

  useEffect(() => {
    onChangeStep && onChangeStep(currentStep);
  }, [currentStep, onChangeStep]);

  return (
    <div className="flex flex-col">
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
      <div className="flex flex-1 justify-between items-center bg-background-content p-32 absolute z-10 left-0 top-0 right-0">
        <NextLink href="/" passHref legacyBehavior>
          <Link strong={true} variant="tertiary" className="text-base min-w-[10.4rem]">
            Avbryt
          </Link>
        </NextLink>
        <ProgressStepper
          className="w-full max-w-[82rem]"
          steps={steps.map((step) => step.label)}
          current={currentStep}
          // rounded={true}
          size={'sm'}
        ></ProgressStepper>
        <Button className="min-w-[10.4rem]" variant="secondary" onClick={openHelpComposer}>
          <Icon icon={<HelpCircle />} /> Hjälp
        </Button>
      </div>
      <div className="py-32">{steps[currentStep].component}</div>
      <div className="flex flex-row justify-end gap-16">
        <div>
          {currentStep !== 0 && (
            <Button variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} /* leftIcon={<ArrowLeft />} */>
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
              onClick={() => handleNextClicked()}
              // disabled={!steps[currentStep].valid}
              color="vattjom"
              rightIcon={<ArrowRight />}
            >
              Nästa
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
