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
  type BaseError,
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { getAccount, getEnsAddress, getEnsName } from "@wagmi/core";
import { useDiscussion } from "@/hooks/use-discussions";
import * as gtag from "@/lib/gtag";
import { networkNames } from "@/lib/network";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { config } from "../wagmiConfig";
import { formatUnits, isAddress, parseEther } from "viem";
import { normalize } from "path";

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

  const { chainId } = getAccount(config);
  const chain = config.chains.find((chain) => chain.id === chainId);

  const toast = useToast();
  const router = useRouter();
  const ensName = getEnsName(config, {
    address: toAddress as `0x${string}`,
    chainId: 1,
  });
  const { openChainModal } = useChainModal();
  const balance = useBalance({
    address: address,
  });

  const { discussion } = useDiscussion(
    toAddress?.toLowerCase(),
    address?.toLowerCase()
  );
  const [previousText, setPreviousText] = useState("");

  const {
    sendTransaction,
    data: hash,
    isPending,
    error,
  } = useSendTransaction({
    config,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

  const sendMsg = async () => {
    //set preview text, set newMsg and wipe the input bar clean
    setPreviewText(text);
    setPreviousText(text);
    setText("");
    setNewMsg(true);
    //send tx
    sendTransaction(
      {
        to: isAddress(toAddress)
          ? (toAddress as `0x${string}`)
          : ((await getEnsAddress(config, {
              name: normalize(toAddress),
              chainId: 1,
            })) as `0x${string}`),
        value: parseEther("0.0"),
        data: ("0x" + string_to_hex(text)) as `0x${string}`,
      },
      {
        onError(error, variables, context) {
          handleOnError(error);
        },
        onSuccess() {
          handleOnSuccess();
        },
      }
    );
  };

  const handleOnError = (e: any) => {
    //set text back to previousText to return input bar to prev state, set newMsg
    setText(previousText);
    setNewMsg(false);
    setPreviewText("");
    console.log(e);

    toast({
      title: "Denied",
      description: (e as BaseError).shortMessage || e.message,
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
  };

  const handleSend = async () => {
    if (text === "") return;

    if (address) {
      // if (ensName == null || ensName == undefined) {
      //   toast({
      //     title: "Error",
      //     description: "Invalid Address",
      //     status: "error",
      //     duration: 6000,
      //     isClosable: true,
      //   });
      // }
      if (isAddress(toAddress)) {
        sendMsg();
      } else {
        toast({
          title: "Error",
          description: "Invalid Address",
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
        {/* should only show up when user has no eth*/}
        {chain &&
          balance.data?.value &&
          formatUnits(balance.data.value, 18) === "0.0" && (
            <button
              className="hover:underline text-[10px] mx-auto mb-1"
              onClick={openChainModal}
            >
              You have zero balance on {networkNames[chain.id]}. Consider adding
              more
              {chain.id === 11155111 ? networkNames[chain.id] : ""}
              {balance.data?.symbol} or switching chains.
            </button>
          )}
        {/* should only show up when reply is being sent on a different chain from last reply and is not first message*/}
        {chain &&
          balance.data?.value &&
          formatUnits(balance.data.value, 18) === "0.0" &&
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
