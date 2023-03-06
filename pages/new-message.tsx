import { ChatPreview } from "@/components/ChatPreview";
import { AppLayout } from "@/components/appLayout";
import chatPreviewData from "@/mock/chatPreviewMock2.json";
import { NextPage } from "next";
import Link from "next/link";
import InputEmoji from "react-input-emoji";

const NewMessage: NextPage = () => {
  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        {/**cancel button and page header */}
        <Link href={"/"}>
          <p className="absolute hover:underline px-1 text-xs xs:text-base xs:px-5 mt-4 xs:mt-8">
            Cancel
          </p>
        </Link>
        <div className="flex flex-col gap-1 w-full border rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-7">
          <div className="flex justify-center items-center">
            <p className=" break-all font-bold text-sm xs:text-xl mt-8 sm:mt-0">
              New Message
            </p>
          </div>
        </div>
        {/** message recipient input field */}
        <div className="flex flex-col border-t">
          <div className="flex flex-row items-center gap-2 px-1 xs:px-5 py-3">
            <p className="font-bold">To:</p>
            <input
              className="outline-none w-full h-8 break-all"
              type="text"
            ></input>
            {/* <input></input> */}
          </div>
          <div className="w-full bg-gray-200 h-0.5"></div>
        </div>
        {/** show chat messages */}
        <div className="h-full overflow-x-scroll px-1 xs:px-5 py-3"></div>

        {/**show msg input text area */}
        <div className="flex flex-row p-3 rounded-b-3xl">
          <InputEmoji
            theme="light"
            cleanOnEnter
            type="text"
            className="w-full border focus:bg-gray-100 rounded-3xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
            placeholder="Text Message"
          ></InputEmoji>
        </div>
      </div>
    </AppLayout>
  );
};
export default NewMessage;
