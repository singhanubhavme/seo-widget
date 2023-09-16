interface SimpleCardProps {
  title: string;
  text: string;
}

function SimpleCard({ title, text }: SimpleCardProps): JSX.Element {
  return (
    <div className="flex flex-col text-center border border-gray-400 mx-4 rounded-md p-2 px-8 my-4">
      <div className="text-xl font-semibold">{text}</div>
      <div className="text-lg"> {title}</div>
    </div>
  );
}

export default SimpleCard;
