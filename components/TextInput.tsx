import React, { FunctionComponent, useState } from "react";
import InputEmoji from "react-input-emoji";
import { providers } from "ethers";
import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { string_to_hex } from "@/lib/utils";

interface TextInputProps {
  className?: string;
  toAddress: string;
}

export const TextInput: FunctionComponent<TextInputProps> = ({
  className,
  toAddress,
}) => {
  const [text, setText] = useState("");

  const { address, sendTransaction } = useWallet();
  const toast = useToast();
  const router = useRouter();

  const sendMsg = async () => {
    const transactionRequest: providers.TransactionRequest = {
      to: toAddress,
      value: 0,
      data: "0x" + string_to_hex("OCM:" + text),
    };
    try {
      const tx = await sendTransaction(transactionRequest);

      //show toast when tx is included in chain
      (await tx.wait()) &&
        toast({
          title: "Success",
          description: "Message sent.",
          status: "success",
          duration: 6000,
          isClosable: true,
        });
        router.push(`/chat/${toAddress}`)
    } catch (e: any) {
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
          description: "An unexpected error occurred, please try again.",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    }
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

  return (
    <div
      className={`${className} flex flex-row gap-2 items-center p-3 h-max rounded-b-3xl`}
    >
      <input
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        // theme="light"
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
