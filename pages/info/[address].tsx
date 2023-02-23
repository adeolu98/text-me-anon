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

const Info: NextPage = () => {
  const router = useRouter();
  const address = Array.isArray(router.query.address)
    ? router.query.address[0]
    : router.query.address!;

  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <Link href={`/chat/${address}`}>
          <FontAwesomeIcon
            className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
            icon={faChevronLeft}
          ></FontAwesomeIcon>
        </Link>
        <div className="flex flex-col items-center mt-24 px-1 xs:px-5">
          <ProfilePic className="w-3/12"></ProfilePic>
          <p className="font-bold break-all xs:text-lg mt-8">{address}</p>
          <a href="/" className="hover:underline mt-4"> view on explorer</a>
        </div>
      </div>
    </AppLayout>
  );
};

export default Info;
