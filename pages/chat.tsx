import { ChatPreview } from "@/components/ChatPreview";
import chatPreviewData from "@/mock/chatPreviewMock.json";
import { AppLayout } from "@/components/appLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { ProfilePic } from "@/components/ProfilePic";
import { Message } from "@/components/Message";

export default function Chat() {
  return (
    <AppLayout>
      <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        <FontAwesomeIcon
          className="absolute  px-1 xs:px-5 mt-4 xs:mt-7 sm:mt-9"
          icon={faChevronLeft}
        ></FontAwesomeIcon>
        {/** contact info display */}
        <div className="flex flex-col gap-1 w-full border rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-3">
          <div className="w-full mt-1 flex justify-center items-center">
            <ProfilePic className="w-2/12 sm:w-1/12"></ProfilePic>
          </div>
          <div className="text-center">
            <p className="truncate">
              {"0x80805ae3cbE23715C1f1807A03C5fb669541C2A9"}
            </p>
          </div>
        </div>
        {/** show chat messages */}
        <div className="h-full px-1 xs:px-5 py-3">
          {/* <div className="flex flex-row items-center gap-1">
            <div className="rounded-full w-1.5 h-1.5 bg-gray-200"></div>
            <div className="rounded-3xl w-max px-3 py-1 bg-gray-200 ">
              <p>hey man</p>
            </div>
          </div>
          <div className="mt-1 flex flex-row items-center gap-1">
            <div className="rounded-full w-1.5 h-1.5 bg-gray-200"></div>
            <div className="rounded-3xl w-max px-3 py-1 bg-gray-200 ">
              <p>hey man</p>
            </div>
          </div>
          <p className="mt-1 text-[10px] pl-4">14:20 pm</p>  */}

          <Message received = {false} text="hey man" timeSent="14:50"></Message>
        </div>

        {/**show input text area */}
        <div className="flex flex-row p-3 rounded-b-3xl">
          <input
            type="text"
            className=" w-full border focus:bg-gray-100 rounded-3xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
            placeholder="Text Message"
          ></input>
        </div>
      </div>
    </AppLayout>
  );
}
