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
  useAccount,
  useSendTransaction,
  useEnsAddress,
  useBalance,
  useBlockNumber,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useDiscussion } from "@/hooks/use-discussions";
import * as gtag from "@/lib/gtag";
import { networkNames } from "@/lib/network";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { formatUnits, SendTransactionErrorType } from "viem";
import { useQueryClient } from "@tanstack/react-query";

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
  //use state hooks
  const [previousText, setPreviousText] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(1);

  //wagmi hooks
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { chain } = useAccount();
  const toast = useToast();
  const router = useRouter();
  const resolvedENS = useEnsAddress({
    name: toAddress,
  });
  const { openChainModal } = useChainModal();
  const { data: balance, queryKey } = useBalance({
    address: address,
  });
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const formattedBalance =
    balance && formatUnits(balance.value, balance.decimals);
  const { data: hash, error, sendTransaction } = useSendTransaction();

  //custom hooks
  const { discussion } = useDiscussion(
    toAddress.toLowerCase(),
    address?.toLowerCase()
  );

  const sendMsg = async () => {
    //set preview text, set newMsg and wipe the input bar clean
    setPreviewText(text);
    setPreviousText(text);
    setText("");
    setNewMsg(true);
    //send tx

    sendTransaction({
      to: toAddress as `0x${string}`,
      value: BigInt("0"),
      data: ("0x" + string_to_hex(text)) as `0x${string}`,
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleOnError = (e: SendTransactionErrorType) => {
    //set text back to previousText to return input bar to prev state, set newMsg
    setText(previousText);
    setNewMsg(false);
    setPreviewText("");

    toast({
      title: "Error",
      description: `${error?.cause}`,
      status: "error",
      duration: 6000,
      isClosable: true,
    });
  };

  const handleOnSuccess = async () => {
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
      if (resolvedENS == null || resolvedENS == undefined) {
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);

    const height = e.target.scrollHeight;
    const rowHeight = 24;
    const trows = Math.ceil(height / rowHeight) - 1;

    if (trows && textAreaHeight < 6) setTextAreaHeight(trows);
  };

  useEffect(() => {
    if (isConfirmed) {
      handleOnSuccess();
    }

    if (error) {
      handleOnError(error as SendTransactionErrorType);
    }
  }, [isConfirmed, error]);

  useEffect(() => {
    if (blockNumber && Number(blockNumber) % 5 === 0)
      queryClient.invalidateQueries({ queryKey });
  }, [blockNumber, queryClient]);

  //go to chat page after msg sent if sending message from new-message.tsx
  useEffect(() => {
    if (
      discussion &&
      hex_to_string(discussion[discussion.length - 1].text.slice(2)) ===
        previousText
    ) {
      if (router.pathname === `/new-message`) {
        router.push(`/chat/${toAddress.toLowerCase()}`);
      }
    }
  }, [discussion, address, previousText, router, toAddress]);

  useEffect(() => {
    if (text === "") setTextAreaHeight(1);
  }, [text]);

  return (
    <div
      className={`${className} flex flex-row gap-2 items-center p-3 h-max rounded-b-3xl`}
    >
      <div className="flex flex-col w-full">
        {/* should only show up when user has no eth*/}
        {chain && formattedBalance === "0.0" && (
          <button
            className="hover:underline text-[10px] mx-auto mb-1"
            onClick={openChainModal}
          >
            You have zero balance on {networkNames[chain.id]}. Consider adding
            more{" "}
            {chain.id === 5 || chain.id === 11155111
              ? networkNames[chain.id]
              : ""}{" "}
            {formattedBalance} or switching chains.
          </button>
        )}
        {/* should only show up when reply is being sent on a different chain from last reply and is not first message*/}
        {chain &&
          formattedBalance !== "0.0" &&
          discussion &&
          discussion?.[discussion?.length - 1]?.id !== chain.id && (
            <button
              className="hover:underline text-[10px] mx-auto mb-1"
              onClick={openChainModal}
            >
              Most recent message was sent on{" "}
              {networkNames[discussion?.[discussion.length - 1].id]}. You are
              replying on {networkNames[chain.id]}. <br /> Click to change if
              this is unintended.
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
        className="h-10 text-gray-400 self-end"
        icon={faArrowCircleUp}
        onClick={handleSend}
      ></FontAwesomeIcon>
    </div>
  );
};
