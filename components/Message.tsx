import React, { FunctionComponent } from "react";

interface MessageProps {
  className?: string;
  text: string;
  timeSent: string;
  received: boolean;
}

export const Message: FunctionComponent<MessageProps> = ({ className, text, timeSent, received }) => {
  return (
    <div className={`${className} flex ${received ? 'flex-row' :'flex-row-reverse'} items-center gap-1`}>
      <div className="w-2">
        <div className={`rounded-full w-1.5 h-1.5 ${received ? 'bg-gray-300' : 'bg-gray-100'}`}></div>
      </div>
      <div className={`rounded-3xl h-max flex flex-col w-max break-all px-4 py-1.5 ${received ? 'bg-gray-300' : 'bg-gray-100'} `}>
        <p>{text}</p>
        <div className="relative w-full flex justify-end pl-16">
          <p className=" text-[8px]">{timeSent} pm</p>
        </div>
      </div>
    </div>
  );
};
