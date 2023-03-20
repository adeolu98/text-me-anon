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
import { useWallet } from "@/hooks/use-wallet";
import { useDiscussion } from "@/hooks/use-discussions";
import { getTime, hex_to_string } from "@/lib/utils";

const Chat: NextPage = () => {
  const router = useRouter();
  const { address } = useWallet();

  const toAddress = Array.isArray(router.query.address)
    ? router.query.address[0]
    : router.query.address!;

  const discussion = useDiscussion(
    toAddress === address ? "myself" : toAddress
  );

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


  useEffect(() => {
    if (discussion?.length !== lengthBeforeNewMsg) {
      //check new msg object to see that its not msg from recipient
      console.log("from", discussion![discussion!.length - 1].from);

      if (discussion![discussion!.length - 1].from === address) {
        setNewMsg(false);
      }
      setLengthBeforeNewMsg(discussion?.length);
    }
  }, [discussion]);

  useEffect(() => {
    if (!scrollOnOpen) {
      handleClickScroll();
      setScrollOnOpen(true);
    }

    if (newMsg) handleClickScroll();
  }, [newMsg]);

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
          <Link href={"/"}>
            <FontAwesomeIcon
              className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
              icon={faChevronLeft}
            ></FontAwesomeIcon>
          </Link>
          {/** contact info display */}
          <Link href={`/info/${toAddress}`}>
            <div className="flex flex-col gap-1 w-full border rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-3">
              <div className="w-full mt-1 flex justify-center items-center">
                <ProfilePic addressForProfileIcon = {toAddress} className="w-2/12 sm:w-1/12"></ProfilePic>
              </div>
              <div className="text-center">
                <p className="truncate">{toAddress}</p>
              </div>
            </div>
          </Link>
          {/** show chat messages */}
          <div className="h-full overflow-x-scroll px-1 xs:px-5 py-3">
            {discussion?.map((msgData, index) => {
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
                    received={msgData.from === toAddress}
                    text={hex_to_string(msgData.text).slice(5)}
                    timeSent={getTime(msgData.timestamp)}
                  ></Message>
                </div>
              );
            })}
            {newMsg && (
              <div id={"last-msg"}>
                <Message received={false} text={previewText}></Message>
              </div>
            )}
          </div>

          {/**show input text area */}
          <TextInput
            text={text}
            setText={setText}
            setNewMsg={setNewMsg}
            setPreviewText={setPreviewText}
            toAddress={toAddress === "myself" ? address : toAddress}
          ></TextInput>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="text-9xl"
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
