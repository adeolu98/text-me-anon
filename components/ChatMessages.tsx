import { hex_to_string, getTime } from "@/lib/utils";
import { Spinner } from "@chakra-ui/react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Message } from "./Message";
import { ProfilePic } from "./ProfilePic";
import { TextInput } from "./TextInput";
import { useEffect, useState } from "react";
import { useDiscussion } from "@/hooks/use-discussions";
import { useEnsName } from "wagmi";
import { ChatMode, FetchStatus } from "@/lib/types"; 


  const handleClickScroll = () => {
    const element = document.getElementById("last-msg");
    if (element) {
      element.scrollIntoView();
    }
  };


interface ChatMessagesProps {
  receiver: string;
  sender: string;
  mode: ChatMode;
}

function ChatMessages(props: ChatMessagesProps) {
  const { receiver, sender, mode } = props;
  const {discussion, fetchStatus, loaded} = useDiscussion(receiver, sender);
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

  const { data } = useEnsName({
    address: receiver ? `0x${receiver.slice(2)}` : undefined,
    chainId: 1,
  });

  useEffect(() => {
    if (discussion && discussion?.length !== lengthBeforeNewMsg) {
      //check new msg object to see that its not msg from recipient
      if (discussion![discussion!.length - 1].from === sender?.toLowerCase()) {
        setNewMsg(false);
      }
      setLengthBeforeNewMsg(discussion?.length);
    }
    discussion && setCurrentMsgsChain(discussion[0].id);
  }, [discussion]);

  useEffect(() => {
    //scroll to most recent text by default on page open
    if (scrollOnOpen === false && discussion) {
      handleClickScroll();
      setScrollOnOpen(true);
    }
  }, [discussion]);

  useEffect(() => {
    //scroll to most recent text when sending a new message regardless of how far up user has scrolled
    if (newMsg === true) handleClickScroll();
  }, [newMsg]);

  return (
    <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 lg:w-3/6 xl:w-2/6">
      <Link
        href={mode === ChatMode.CHAT ? "/" : `/watch/${sender}`}
        className=""
        title="Go back"
      >
        <FontAwesomeIcon
          className="absolute py-4 px-1 xs:px-5 mt-4"
          icon={faChevronLeft}
          width={50}
          height={50}
        ></FontAwesomeIcon>
      </Link>
      {/** contact info display */}
      <Link href={`/info/${receiver}`} title="Click to view more info">
        <div className="flex flex-col gap-1 w-full rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-3">
          <div className="w-full mt-1 flex justify-center items-center">
            <ProfilePic
              addressForProfileIcon={receiver}
              className="w-2/12 sm:w-1/12"
            ></ProfilePic>
          </div>
          <div className="text-center">
            <p className="truncate">
              {data
                ? data
                : receiver === sender.toLowerCase() && mode === ChatMode.CHAT
                ? "myself"
                : receiver}
            </p>
          </div>
        </div>
        <div className="bg-gray-200 h-[1px] w-full"></div>
      </Link>
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
                  received={msgData.from.toLowerCase() !== sender.toLowerCase()}
                  text={hex_to_string(msgData.text)}
                  timeSent={getTime(msgData.timestamp)}
                  network={msgData.id}
                  hash={msgData.hash}
                ></Message>
              </div>
            );
          })
        ) : (
          <div className="pt-8 w-full flex justify-center gap-4">
            {fetchStatus === FetchStatus.PENDING  && !loaded
              ?
              <>
                <p className="text-sm  font-light">
                  No messages found, searching..
                </p>
                <div>
                  <Spinner size="md" />
                </div>
              </>
              : <p className="text-sm  font-light">
                  No messages found
                </p>
            }
          </div>
        )}
        {newMsg && (
          <div id={"last-msg"}>
            <Message received={false} text={previewText}></Message>
          </div>
        )}
      </div>

      {/**show input text area */}
      {mode === ChatMode.CHAT ? (
        <>
          <div className="hidden lg:block">
            <TextInput
              text={text}
              enableOnKeydown={true}
              setText={setText}
              setNewMsg={setNewMsg}
              setPreviewText={setPreviewText}
              toAddress={receiver}
            ></TextInput>
          </div>
          <div className="block lg:hidden">
            <TextInput
              text={text}
              enableOnKeydown={false}
              setText={setText}
              setNewMsg={setNewMsg}
              setPreviewText={setPreviewText}
              toAddress={receiver}
            ></TextInput>
          </div>
        </>
      ) : (
        <div className="text-[14px] mx-auto mb-2">You are in watch mode.</div>
      )}
    </div>
  );
}


export default ChatMessages