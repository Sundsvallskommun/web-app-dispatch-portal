import { Badge, Divider } from '@sk-web-gui/react';

interface ProgressStepperProps {
  steps: string[];
  current: number;
  className?: string;
  vertical?: boolean;
  ellipsisLength?: number;
  noWrap?: boolean;
}

const ProgressStepper = ({
  steps,
  current,
  className = '',
  vertical = false,
  ellipsisLength = 0,
  noWrap = true,
}: ProgressStepperProps) => {
  return (
    <div
      className={`flex justify-between items-center ${className} ${vertical ? 'flex-col gap-4' : 'flex-row gap-16'}`}
    >
      {steps.map((step, i) => {
        const showEllipsis = ellipsisLength > 0 && step.length >= ellipsisLength;
        const label = showEllipsis ? `${step.slice(0, ellipsisLength).trim()}...` : step;

        return (
          <div
            className={`flex items-center ${vertical ? 'flex-col' : 'flex-row gap-16'} ${steps.length !== i + 1 ? 'grow' : ''}`}
            key={i}
          >
            <div className="flex items-center gap-8">
              <Badge counter={i + 1} color={current === i ? 'tertiary' : 'vattjom'} className={'dark:text-white'} />
              <p
                className={`${current === i ? 'font-bold' : 'font-normal'} ${noWrap ? 'whitespace-nowrap' : 'whitespace-normal'} inline-block`}
              >
                {label}
              </p>
            </div>
            {steps.length !== i + 1 && (
              <div className={vertical ? 'w-auto' : 'w-full'}>
                <Divider orientation={vertical ? 'vertical' : 'horizontal'} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
