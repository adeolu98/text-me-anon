import React, { FunctionComponent } from "react";

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
    <div className={` ${className} w-full flex flex-row gap-2 sm:gap-4`}>
      <div className="w-2/12 flex items-center">
        <img
          className="w-full"
          object-fit="contain"
          alt="profile-pic"
          src={profilePic ? profilePic : "/profilePlaceholderPic.svg"}
        ></img>
      </div>
      <div className="flex flex-col w-10/12">
        <div className="flex flex-row w-full gap-4 justify-between">
          <div className="text-lg font-bold truncate">{contactAddr}</div>
          <div className="text-xs"> {lastMessageTime}</div>
        </div>
        <div className="w-full">
          <p className="truncate">{lastMessage}</p>
        </div>
      </div>
    </div>
  );
};
