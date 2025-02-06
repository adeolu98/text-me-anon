import React, { FunctionComponent, useCallback, useMemo } from "react";
import { useEnsName, useAccount } from "wagmi";
import { ProfilePic } from "./ProfilePic";
import { ChatMode } from "../lib/types";
import { shorten } from "@/lib/utils";
import { useRouter } from "next/router";

interface ChatPreviewProps {
  lastMessage: string;
  lastMessageTime: string;
  receiver: string;
  sender?: string;
  className?: string;
  replied: boolean;
  mode: ChatMode;
  ensNameForAddress?: string | null;
}

export const ChatPreview: FunctionComponent<ChatPreviewProps> = ({
  lastMessage,
  lastMessageTime,
  receiver,
  sender,
  className,
  replied,
  mode,
  ensNameForAddress,
}) => {
  const { data } = useEnsName({
    address: `0x${receiver.slice(2)}`,
    chainId: 1,
  });
  const router = useRouter();

  const { address } = useAccount();
  const _sender = sender || address;

  const chatLink = useMemo(() => {
    return ChatMode.CHAT === mode
      ? `/chat/${receiver}`
      : `/watch/?sender=${_sender}&receiver=${receiver}`;
  }, [_sender, mode, receiver]);

  const onClick = useCallback(() => {
    router.push(chatLink);
  }, [chatLink, router]);

  return (
    <div>
      <div
        className={` ${className} w-full flex flex-row items-center gap-2 sm:gap-4`}
      >
        <ProfilePic
          addressForProfileIcon={receiver}
          className="w-2/12"
        ></ProfilePic>
        <div className="flex flex-col gap-1 md:gap-2 w-9/12"  onClick={onClick} title="Click to open chat">
          <div className="flex flex-row w-full justify-between">
            <div
              className={`text-lg w-full font-bold ${
                data ? "break-all" : "truncate"
              }`}
            >
              {data
                ? receiver.toLowerCase() === address?.toLowerCase()
                  ? "myself"
                  : data
                : receiver.toLowerCase() === address?.toLowerCase()
                ? "myself"
                : receiver}
            </div>
            <div className="text-xs w-5/12 text-right"> {lastMessageTime}</div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="truncate">{lastMessage}</p>
            {replied && (
              <div
                title={
                  mode === ChatMode.CHAT
                    ? "You have not replied to this conversation"
                    : `${!ensNameForAddress ? shorten(_sender || "") : ensNameForAddress} has not replied`
                }
                className="px-2 py-1 border border-gray-300 rounded-xl"
              >
                <p className="text-black text-xs font-light">not replied</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
