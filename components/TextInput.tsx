import React, {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
//import InputEmoji from "react-input-emoji";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { hex_to_string, string_to_hex } from "@/lib/utils";
import {
  useNetwork,
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
  useEnsAddress,
} from "wagmi";
import { useDiscussion } from "@/hooks/use-discussions";
import * as gtag from "@/lib/gtag";
import { networkNames } from "@/lib/network";
import { useChainModal } from "@rainbow-me/rainbowkit";

interface TextInputProps {
  text: string;
  previewText?: string;
  setText: Dispatch<SetStateAction<string>>;
  setPreviewText: Dispatch<SetStateAction<string>>;
  setNewMsg: Dispatch<SetStateAction<boolean>>;
  className?: string;
  toAddress: string;
  enableOnKeydown: boolean;
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  text,
  previewText,
  setText,
  setPreviewText,
  setNewMsg,
  className,
  toAddress,
  enableOnKeydown,
}) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const toast = useToast();
  const router = useRouter();
  const { data } = useEnsAddress({
    name: toAddress,
    chainId: 1
  });
  const {openChainModal} = useChainModal()

  const discussion = useDiscussion(
    toAddress.toLowerCase() === address?.toLowerCase()
      ? "myself"
      : toAddress.toLowerCase()
  );
  const [previousText, setPreviousText] = useState("");
  const { config } = usePrepareSendTransaction({
    request: {
      to: toAddress,
      value: "0",
      data: "0x" + string_to_hex("OCM:" + text),
    }
  });
  const { sendTransaction } = useSendTransaction({
    ...config,
    onSuccess(data) {
      handleOnSuccess(data);
    },
    onError(e: any) {
      handleOnError(e);
    },
  });

  //go to chat page after msg sent if sending message from new-message.tsx
  useEffect(() => {
    if (
      discussion &&
      hex_to_string(discussion[discussion.length - 1].text).slice(5) ===
        previousText
    ) {

      if (router.pathname === `/new-message`) {
        router.push(
          `/chat/${
            toAddress.toLowerCase() === address?.toLowerCase()
              ? "myself"
              : toAddress.toLowerCase()
          }`
        );
      }
    }
  }, [discussion, address]);

  useEffect(() => {
    if (text === "") setTextAreaHeight(1);
  }, [text]);

  const sendMsg = async () => {
    //set preview text, set newMsg and wipe the input bar clean
    setPreviewText(text);
    setPreviousText(text);
    setText("");
    setNewMsg(true);
    //send tx
    sendTransaction?.();
  };

  const handleOnError = (e: any) => {
    //set text back to previousText to return input bar to prev state, set newMsg
    setText(previousText);
    setNewMsg(false);
    setPreviewText("");

    if (e.code === 4001) {
      toast({
        title: "Denied",
        description: "You denied the transaction.",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "Please try again.",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  const handleOnSuccess = async (data: any) => {
    //send google analytics events
    gtag.event({
      action: "total_messages_sent_all_chains",
      category: "usage",
      label: "",
      value: "",
    });

    gtag.event({
      action: `total_messages_sent_${chain?.name}`,
      category: "usage",
      label: "",
      value: "",
    });

    //show toast when tx is included in chain
    (await data?.wait()) &&
      toast({
        title: "Success",
        description: `Message tx included in chain`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
  };

  const handleSend = async () => {
    if (text === "") return;

    if (address) {
      if (data == null || data == undefined){
        toast({
          title: "Error",
          description: "Invalid Address",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } else if (toAddress !== "") {
        sendMsg();
      }
    } else {
      toast({
        title: "Error",
        description: "Connect wallet first",
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && enableOnKeydown) {
      e.preventDefault();
      handleSend();
    }
  };

  const [textAreaHeight, setTextAreaHeight] = useState(1);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);

    const height = e.target.scrollHeight;
    const rowHeight = 24;
    const trows = Math.ceil(height / rowHeight) - 1;

    if (trows && textAreaHeight < 6) setTextAreaHeight(trows);
  };
  return (
    <div
      className={`${className} flex flex-row gap-2 items-center p-3 h-max rounded-b-3xl`}
    >
      <div className="flex flex-col w-full">
        {/* should only show up when reply is being sent on a different chain from last reply and is not first message*/}
        {chain && discussion?.[discussion?.length-1]?.id !== chain.id && (
          <button className="underline text-[10px] mx-auto mb-1" onClick={openChainModal}>
            You are replying on {networkNames[chain.id]}
          </button>
        )}
        <textarea
          onKeyDown={(e) => handleKeydown(e)}
          value={text}
          onChange={(e) => handleChange(e)}
          className={`w-full border resize-none focus:bg-gray-100 rounded-3xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none`}
          placeholder="Text Message"
          rows={textAreaHeight}
        ></textarea>
      </div>
        <FontAwesomeIcon
          className="h-8 text-gray-400 mt-[15px]"
          icon={faArrowCircleUp}
          onClick={handleSend}
        ></FontAwesomeIcon>
    </div>
  );
};
