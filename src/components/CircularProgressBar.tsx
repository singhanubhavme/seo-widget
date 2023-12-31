import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularProgressBarProps {
  percentage: number;
  title: string;
}

function CircularProgressBar({
  percentage,
  title,
}: CircularProgressBarProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center mx-4">
      <CircularProgressbar
        styles={{
          text: {
            fill: '#3e98c7',
            fontSize: '24px',
          },
        }}
        value={percentage}
        text={`${percentage}%`}
      />
      <div className="text-center mx-auto ">{title}</div>
    </div>
  );
}

export default CircularProgressBar;
