import React, { FunctionComponent } from "react";
import { ProfilePic } from "./ProfilePic";
import Link from "next/link";

interface ChatPreviewProps {
  lastMessage: string;
  lastMessageTime: string;
  profilePic?: string;
  contactAddr: string;
  className?: string;
}

export const ChatPreview: FunctionComponent<ChatPreviewProps> = ({
  lastMessage,
  lastMessageTime,
  profilePic,
  contactAddr,
  className,
}) => {

  return (
    <Link href={`/chat/${contactAddr}`}>
      <div className={` ${className} w-full flex flex-row items-center gap-2 sm:gap-4`}>
       <ProfilePic  addressForProfileIcon = {contactAddr} className="w-2/12"></ProfilePic>
        <div className="flex flex-col w-9/12">
          <div className="flex flex-row w-full justify-between">
            <div className="text-lg font-bold truncate">{contactAddr}</div>
            <div className="text-xs"> {lastMessageTime}</div>
          </div>
          <div className="w-full">
            <p className="truncate">{lastMessage}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
