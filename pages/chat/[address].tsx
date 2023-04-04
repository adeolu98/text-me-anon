import { AppLayout } from "@/components/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import { Message } from "@/components/Message";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { useDiscussion } from "@/hooks/use-discussions";
import { getTime, hex_to_string } from "@/lib/utils";
import { Spinner } from "@chakra-ui/react";
import { useAccount, useEnsName } from "wagmi";
import { networkNames } from "@/lib/network";

const Chat: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  const toAddress = Array.isArray(router.query.address)
    ? router.query.address[0].toLowerCase()
    : router.query.address!;

  const discussion = useDiscussion(
    toAddress === address?.toLowerCase() ? "myself" : toAddress
  );

  const { data } = useEnsName({
    address: toAddress ? `0x${toAddress.slice(2)}` : undefined,
  });

  const [text, setText] = useState("");
  const [previewText, setPreviewText] = useState("");
  //tracks new msg entered by sender
  const [newMsg, setNewMsg] = useState(false);
  //tracks if chat age has scrolled to last msg on first open, its meant to do that only once
  const [scrollOnOpen, setScrollOnOpen] = useState(false);
  //track the current length of discussion before a new msg is sent
  const [lengthBeforeNewMsg, setLengthBeforeNewMsg] = useState<
    Number | undefined
  >(discussion?.length);
  const [currentMsgsChain, setCurrentMsgsChain] = useState<
    number | undefined
  >();

  useEffect(() => {
    if (discussion && discussion?.length !== lengthBeforeNewMsg) {
      //check new msg object to see that its not msg from recipient
      if (discussion![discussion!.length - 1].from === address?.toLowerCase()) {
        setNewMsg(false);
      }
      setLengthBeforeNewMsg(discussion?.length);
    }
    discussion && setCurrentMsgsChain(discussion[0].id);
  }, [discussion]);

  useEffect(() => {
    if (!scrollOnOpen && discussion) {
      handleClickScroll();
      setScrollOnOpen(true);
    }

    if (newMsg) handleClickScroll();
  }, [newMsg, discussion]);

  const handleClickScroll = () => {
    const element = document.getElementById("last-msg");
    if (element) {
      element.scrollIntoView();
    }
  };

  return (
    <AppLayout>
      {address ? (
        <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 lg:w-3/6 xl:w-2/6">
          <Link href={"/"} className="" title="Go back">
            <FontAwesomeIcon
              className="absolute py-4 px-1 xs:px-5 mt-4"
              icon={faChevronLeft}
              width={50}
              height={50}
            ></FontAwesomeIcon>
          </Link>
          {/** contact info display */}
          <Link href={`/info/${toAddress}`} title="Click to view more info">
            <div className="flex flex-col gap-1 w-full rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-3">
              <div className="w-full mt-1 flex justify-center items-center">
                <ProfilePic
                  addressForProfileIcon={toAddress}
                  className="w-2/12 sm:w-1/12"
                ></ProfilePic>
              </div>
              <div className="text-center">
                <p className="truncate">
                  {data
                    ? data
                    : toAddress === address.toLowerCase()
                    ? "myself"
                    : toAddress}
                </p>
              </div>
            </div>
            <div className="bg-gray-200 h-[1px] w-full"></div>
          </Link>
          {currentMsgsChain && (
            <p className="text-center text-xs p-1 font-light">
              Conversation with{" "}
              {toAddress === address.toLowerCase()
                ? "myself"
                : toAddress.slice(0, 6)}{" "}
              on {networkNames[currentMsgsChain!]}
            </p>
          )}
          {/** show chat messages */}
          <div className="h-full overflow-x-none overflow-y-auto px-1 xs:px-5 pt-3  pb-6">
            {discussion && discussion.length > 0 ? (
              discussion.map((msgData, index) => {
                return (
                  <div
                    key={index}
                    className=""
                    id={
                      index === discussion.length - 1 && newMsg === false
                        ? "last-msg"
                        : ""
                    }
                  >
                    <Message
                      received={
                        msgData.from.toLowerCase() !== address.toLowerCase()
                      }
                      text={hex_to_string(msgData.text).slice(5)}
                      timeSent={getTime(msgData.timestamp)}
                    ></Message>
                  </div>
                );
              })
            ) : (
              <div className="pt-8 w-full flex justify-center gap-4">
                <p className="text-sm  font-light">
                  No messages found, searching..
                </p>
                <div>
                  <Spinner size="md" />
                </div>
              </div>
            )}
            {newMsg && (
              <div id={"last-msg"}>
                <Message received={false} text={previewText}></Message>
              </div>
            )}
          </div>

          {/**show input text area */}
          <div className="hidden lg:block">
            <TextInput
              text={text}
              enableOnKeydown={true}
              setText={setText}
              setNewMsg={setNewMsg}
              setPreviewText={setPreviewText}
              toAddress={toAddress === "myself" ? address : toAddress}
            ></TextInput>
          </div>
          <div className="block lg:hidden">
            <TextInput
              text={text}
              enableOnKeydown={false}
              setText={setText}
              setNewMsg={setNewMsg}
              setPreviewText={setPreviewText}
              toAddress={toAddress === "myself" ? address : toAddress}
            ></TextInput>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            width={100}
            height={100}
          ></FontAwesomeIcon>
          <p className="text-center font-bold font-xl">
            Please connect wallet to see messages
          </p>
        </div>
      )}
    </AppLayout>
  );
};

export default Chat;
