import { Card, Icon } from '@sk-web-gui/react';
import { ReactElement } from 'react';

const MainCard = ({
  icon,
  title,
  contentText,
  subContentText,
}: {
  icon: ReactElement;
  title: string;
  contentText: string;
  subContentText: string;
}) => {
  return (
    <Card className="card-fix card-button-icon-fix flex-1" color="vattjom" invert={true} useHoverEffect>
      <Card.Body className="flex flex-col p-0 gap-12">
        <Card.Header className="flex items-center gap-12 self-stretch">
          <Icon className="card-icon-fix bg-Dark-Secondary text-dark-secondary" size={'28px'} icon={icon} />
          <div className="header-font text-dark-primary lining-nums proportional-nums text-h3-sm">{title}</div>
        </Card.Header>
        <Card.Text className="flex flex-col gap-12 justify-center items-start self-stretch overflow-hidden text-dark-secondary">
          <div className="h-max">{contentText}</div>
          <div className="h-max">{subContentText}</div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MainCard;
