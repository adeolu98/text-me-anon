import { ChatPreview } from "@/components/ChatPreview";
import { AppLayout } from "@/components/appLayout";
import chatPreviewData from "@/mock/chatPreviewMock2.json";
import { NextPage } from "next";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect(() => {
    console.log(Object.entries(chatPreviewData));
  }, []);

  return (
    <AppLayout>
      <div className="border shadow-2xl py-8 flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
        {/**top section with create new message icon */}
        <div className="flex flex-col xs:flex-row justify-between px-1 xs:px-5">
          <div className="text-xs xs:text-base sm:text-xl font-bold">
            Messages
          </div>
          <div>
            <img
              width={20}
              height={20}
              alt="message-plus-icon"
              src="https://img.icons8.com/ios/50/null/new-message.png"
            />
          </div>
        </div>
        {/**search images */}
        <div className="w-full py-4 px-1 xs:px-5">
          <input
            type="text"
            className=" w-full border focus:bg-gray-100 rounded-xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
            placeholder="search"
          ></input>
        </div>
        {/** contacts chat preview  */}
        <div className="w-full overflow-x-scroll px-1 xs:px-5">
          {Object.entries(chatPreviewData).map((data, index) => {
            return (
              <div
                key={index}
                className="w-full flex flex-col gap-4 pt-5 px-1 rounded-lg hover:bg-gray-200"
              >
                <ChatPreview
                  lastMessage={data[1][data[1].length - 1]!.message}
                  lastMessageTime={data[1][data[1].length - 1]!.timeOfMessage}
                  contactAddr={data[0]}
                ></ChatPreview>
                <div className="w-full  h-0.5 flex justify-end">
                  <div
                    className={`w-10/12 h-0.5 ${
                      index !== Object.entries(chatPreviewData).length - 1 && "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
export default Home;