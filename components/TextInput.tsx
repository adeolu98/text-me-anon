import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
  } from "react";
  //import InputEmoji from "react-input-emoji";
  import { providers } from "ethers";
  import { faArrowCircleUp } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { useWallet } from "@/hooks/use-wallet";
  import { useToast } from "@chakra-ui/react";
  import { useRouter } from "next/router";
  import { string_to_hex } from "@/lib/utils";
  
  interface TextInputProps {
    text: string;
    setText: Dispatch<SetStateAction<string>>;
    setPreviewText: Dispatch<SetStateAction<string>>;
    setNewMsg: Dispatch<SetStateAction<boolean>>;
    className?: string;
    toAddress: string;
  }
  
  export const TextInput: FunctionComponent<TextInputProps> = ({
    text,
    setText,
    setPreviewText,
    setNewMsg,
    className,
    toAddress,
  }) => {
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
          //set preview text, set newMsg and wipe the input bar clean
          setText("");
          setPreviewText(text);
          setNewMsg(true);
        //send tx
        const tx = await sendTransaction(transactionRequest);
  
        //show toast when tx is included in chain
        (await tx.wait()) &&
          toast({
            title: "Success",
            description: `Message tx included in chain`,
            status: "success",
            duration: 6000,
            isClosable: true,
          });
        
       //go to chat page if msg sent from new-message page
       setTimeout(() => {
          if (router.pathname === `/new-message`  ) router.push(`/chat/${toAddress === address ? 'myself' : toAddress }`);
       }, 4500); //set timeout because etherscan lags and might not have tx data if we go to chat immediately 
  
      } catch (e: any) {
        //set text back to prev Text to return input bar to prev state, set newMsg
        setText(text); //inspect
        setNewMsg(false);
        setPreviewText("")
        
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