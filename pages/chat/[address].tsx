import { ChatPreview } from "@/components/ChatPreview";
//import chatPreviewData from "@/mock/chatPreviewMock.json";
import chatPreviewData from "@/mock/chatPreviewMock2.json";
import InputEmoji from "react-input-emoji";
import { AppLayout } from "@/components/appLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import { Message } from "@/components/Message";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useEffect } from "react";
import { TextInput } from "@/components/TextInput";

const Chat: NextPage = () => {
  const router = useRouter();
  const address = Array.isArray(router.query.address)
    ? router.query.address[0]
    : router.query.address!;

  useEffect(() => {
    const handleClickScroll = () => {
      const element = document.getElementById("last-msg");
      if (element) {
        element.scrollIntoView();
      }
    };
    handleClickScroll();
  }, []);

  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <Link href={"/"}>
          <FontAwesomeIcon
            className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
            icon={faChevronLeft}
          ></FontAwesomeIcon>
        </Link>
        {/** contact info display */}
        <Link href={`/info/${address}`}>
        <div className="flex flex-col gap-1 w-full border rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-3">
          <div className="w-full mt-1 flex justify-center items-center">
            <ProfilePic className="w-2/12 sm:w-1/12"></ProfilePic>
          </div>
          <div className="text-center">
            <p className="truncate">{address}</p>
          </div>
        </div>
        </Link>
        {/** show chat messages */}
        <div className="h-full overflow-x-scroll px-1 xs:px-5 py-3">
          {Object.entries(chatPreviewData)
            .find((data) => data[0] === address)![1]
            .map((msgData, index) => {
              return (
                <div
                  className=""
                  id={
                    index ===
                    Object.entries(chatPreviewData).find(
                      (data) => data[0] === address
                    )![1].length -
                      1
                      ? "last-msg"
                      : ""
                  }
                >
                  <Message
                    received={msgData.from === address}
                    text={msgData.message}
                    timeSent={msgData.timeOfMessage}
                  ></Message>
                </div>
              );
            })}
        </div>

        {/**show input text area */}
        <TextInput></TextInput>
      </div>
    </AppLayout>
  );
};

export default Chat;
