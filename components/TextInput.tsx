import React, {
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
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { useDiscussion } from "@/hooks/use-discussions";

interface TextInputProps {
  text: string;
  previewText?: string;
  setText: Dispatch<SetStateAction<string>>;
  setPreviewText: Dispatch<SetStateAction<string>>;
  setNewMsg: Dispatch<SetStateAction<boolean>>;
  className?: string;
  toAddress: string;
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  text,
  previewText,
  setText,
  setPreviewText,
  setNewMsg,
  className,
  toAddress,
}) => {
  const { address } = useAccount();
  const toast = useToast();
  const router = useRouter();
  const discussion = useDiscussion(
    toAddress.toLowerCase() === address?.toLowerCase()
      ? "myself"
      : toAddress.toLowerCase()
  );
  const [previousText, setPreviousText] = useState('')
  const { config } = usePrepareSendTransaction({
    request: {
      to: toAddress,
      value: "0",
      data: "0x" + string_to_hex("OCM:" + text),
    },
  });
  const { data, sendTransaction } = useSendTransaction({
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
        previewText
    ) {
      if (router.pathname === `/new-message`)
        router.push(
          `/chat/${
            toAddress.toLowerCase() === address?.toLowerCase()
              ? "myself"
              : toAddress.toLowerCase()
          }`
        );
    }
  }, [discussion, address]);

  const sendMsg = async () => {
    //set preview text, set newMsg and wipe the input bar clean
    setPreviewText(text);
    setPreviousText(text)
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
    //show toast when tx is included in chain
    (await data?.wait()) &&
      toast({
        title: "Success",
        description: `Message tx included in chain block`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
  };

  const handleSend = async () => {
    if (address) {
      if (toAddress !== "") {
        sendMsg();
      } else {
        toast({
          title: "Error",
          description: "Add message recipient.",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
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

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className={`${className} flex flex-row gap-2 items-center p-3 h-max rounded-b-3xl`}
    >
      <input
        onKeyDown={(e) => handleKeydown(e)}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        type="text"
        className="w-full border focus:bg-gray-100 rounded-3xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
        placeholder="Text Message"
      ></input>
      <FontAwesomeIcon
        className="h-8 text-gray-400"
        icon={faArrowCircleUp}
        onClick={handleSend}
      ></FontAwesomeIcon>
    </div>
  );
};
