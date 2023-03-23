import React, { FunctionComponent, useEffect, useState } from "react";
import { ProfilePic } from "./ProfilePic";
import Link from "next/link";
import { useEnsName } from "wagmi";

interface ChatPreviewProps {
  lastMessage: string;
  lastMessageTime: string;
  contactAddr: string;
  className?: string;
  replied: boolean;
}

export const ChatPreview: FunctionComponent<ChatPreviewProps> = ({
  lastMessage,
  lastMessageTime,
  contactAddr,
  className,
  replied,
}) => {
  const { data } = useEnsName({
    address: `0x${contactAddr.slice(2)}`,
  });

  return (
    <Link href={`/chat/${contactAddr}`} title="Click to open chat">
      <div
        className={` ${className} w-full flex flex-row items-center gap-2 sm:gap-4`}
      >
        <ProfilePic
          addressForProfileIcon={contactAddr}
          className="w-2/12"
        ></ProfilePic>
        <div className="flex flex-col gap-1 md:gap-2 w-9/12">
          <div className="flex flex-row w-full justify-between">
            <div className={`text-lg w-full font-bold ${ data ? 'break-all' : 'truncate'}`}>
              {data ? data : contactAddr}
            </div>
            <div className="text-xs w-5/12 text-right"> {lastMessageTime}</div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="truncate">{lastMessage}</p>
            {replied && <div title="You have not replied to this conversation" className="px-2 py-1 border border-gray-300 rounded-xl"><p className="text-black text-xs font-light">not replied</p></div> }
          </div>
        </div>
      </div>
    </Link>
  );
};
