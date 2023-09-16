import { BsFillCheckCircleFill } from 'react-icons/bs';
import { ImCross } from 'react-icons/im';

interface CardProps {
  correct: boolean;
  title: string;
  description: string;
}

function Card({ correct, title, description }: CardProps): JSX.Element {
  return (
    <div className="flex flex-row items-center border border-gray-400 mx-4 rounded-md p-2 px-4 my-4">
      <div>
        {correct ? (
          <BsFillCheckCircleFill
            style={{ color: 'green' }}
            className="w-4 h-4"
          />
        ) : (
          <ImCross style={{ color: 'red' }} className="w-4 h-4" />
        )}
      </div>
      <div className="flex flex-col ml-5">
        <div className="text-base">{title}</div>
        <div className="opacity-80 text-sm">{description}</div>
      </div>
    </div>
  );
}

export default Card;
