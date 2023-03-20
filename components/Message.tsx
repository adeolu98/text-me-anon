import React, { FunctionComponent } from "react";
import { Spinner } from "@chakra-ui/react";

interface MessageProps {
  className?: string;
  text: string;
  timeSent?: string;
  received: boolean;
}

export const Message: FunctionComponent<MessageProps> = ({
  className,
  text,
  timeSent,
  received,
}) => {
  return (
    <div
      className={`${className} flex ${
        received ? "flex-row" : "flex-row-reverse"
      } items-center gap-1 mt-3`}
    >
      <div className="w-2">
        <div
          className={`rounded-full w-1.5 h-1.5 ${
            received ? "bg-gray-300" : "bg-gray-200"
          }`}
        ></div>
      </div>
      <div
        className={`rounded-3xl h-max flex flex-col gap-1 break-all sm:break-normal xs:gap-0 w-max px-4 py-1.5 ${
          received ? "bg-gray-300" : "bg-gray-100"
        } `}
      >
        <p className="text-sm xs:text-base">{text}</p>
        <div className="relative w-full flex justify-end">
          {
            //if timeSent is undefined, message isn't sent yet onchain
            timeSent ? (
              <p className=" text-[8px]">{timeSent}</p>
            ) : (
              <Spinner size="xs"/>
            )
          }
        </div>
      </div>
    </div>
  );
};
