import { Spinner } from "@chakra-ui/react";
import Image from "next/image";
import React, { FunctionComponent } from "react";
import { Network, networkLogos, etherscanUrl, networkNames } from "@/lib/network";
import { shorten } from "@/lib/utils";
import { useEnsName } from "wagmi";

interface MessageProps {
  className?: string;
  text: string;
  timeSent?: string;
  received: boolean;
  network?: Network;
  hash?: string;
  from?: string;
}

export const Message: FunctionComponent<MessageProps> = ({
  className,
  text,
  timeSent,
  received,
  network,
  hash,
  from
}) => {

  const {data} = useEnsName ({
    address: `0x${from?.slice(2)}`,
    chainId: 1
  })
  return (
    <div
      className={`${className} flex ${
        received ? "flex-row" : "flex-row-reverse"
      } items-center gap-1 mt-3`}
      title={ network && `Sent on ${networkNames[network]} by ${data ? data : shorten(from || '')}`}
    >
      <div className="w-2">
        <div
          className={`rounded-full w-1.5 h-1.5 ${
            received ? "bg-gray-300" : "bg-gray-200"
          }`}
        ></div>
      </div>
      <div
        className={`rounded-3xl h-max flex flex-col gap-1 break-all sm:break-normal xs:gap-0 max-w-[90%] px-4 py-1.5 ${
          received ? "bg-gray-300" : "bg-gray-100"
        } `}
      >
        <p className="text-sm xs:text-base">{text}</p>
        <div className="relative w-full flex justify-end">
          {
            //if timeSent is undefined, message isn't sent yet onchain
            timeSent && network ? (
              <>
                <p className=" text-[8px]">{timeSent}</p>
                <a target="_blank" href={`${etherscanUrl[network]}/tx/${hash}`} className="w-[8px] flex justify-center ml-1" rel="noreferrer">
                  <Image src={networkLogos[network]} alt="" />
                </a>
              </>
            ) : (
              <Spinner size="xs" />
            )
          }
        </div>
      </div>
    </div>
  );
};
