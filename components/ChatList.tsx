import { hex_to_string, getTime } from "@/lib/utils";
import { Spinner } from "@chakra-ui/react";
import { faLink, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ChatPreview } from "./ChatPreview";
import SearchInput from "./SearchInput";
import { useDiscussions } from "@/hooks/use-discussions";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useEnsAddress } from "wagmi";


export enum ChatMode {
  WATCH = "watch",
  CHAT = "chat",
}

interface ChatListProps{
  address: string,
  mode: ChatMode
}

const copyMessage = {
  [ChatMode.CHAT]: [
    "Click to copy your address link",
    "Copied! Now share it with other anons",
  ],
  [ChatMode.WATCH]: [
    "Click to copy this address link",
    "Copied! Now share it with other anons",
  ],
};

function ChatList(props: ChatListProps){
  const {address, mode} = props;
  const [changeCopyLinkFavicon, setChangeCopyLinkFavicon] = useState(false);
  const [bounce, setBounce] = useState("");
  const [filterFor, _setFilterFor] = useState("");

  //sort in descending order of timestamp
  const discussions = Object.entries(useDiscussions(address) || []).sort(
    (a, b) => b[1][b[1].length - 1].timestamp - a[1][a[1].length - 1].timestamp
  );
  const startBounce = () => {
    setTimeout(() => {
      setBounce("animate-bounce");
    }, 10000);
  };

  const { data } = useEnsAddress({
    name: filterFor,
    chainId: 1,
  });

  useEffect(() => {
    if (data) _setFilterFor(data.toLowerCase());
  }, [filterFor]);


  const setFilterFor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      _setFilterFor(
        e.currentTarget.value.toLowerCase() === address?.toLowerCase()
          ? "myself"
          : e.currentTarget.value.toLowerCase()
      ),
    [address]
  );

  useEffect(() => {
    address && discussions.length === 0 ? startBounce() : setBounce("");
  }, [address, discussions]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${mode}/${address?.toLowerCase()}`
    );
    setChangeCopyLinkFavicon(true);

    setTimeout(() => {
      setChangeCopyLinkFavicon(false);
    }, 2000);
  };

  return (
    <div className="border shadow-2xl py-8 flex flex-col rounded-3xl h-full w-full sm:w-4/6 lg:w-3/6 xl:w-2/6">
      {/**top section with create new message icon */}
      <div className="flex flex-col xs:flex-row justify-between px-1 xs:px-5">
        <div className="flex-flex-col">
          <div className="text-xs xs:text-base sm:text-xl font-bold">
            Messages
          </div>
          <div className="hidden sm:block">
            <div
              className="hover:underline text-blue-800 cursor-copy text-xs py-2 flex flex-row items-center gap-1"
              onClick={handleCopy}
            >
              <p>
                {!changeCopyLinkFavicon
                  ? copyMessage[mode][0]
                  : copyMessage[mode][1]}
              </p>
              {!changeCopyLinkFavicon ? (
                <FontAwesomeIcon
                  width={15}
                  height={15}
                  icon={faLink}
                ></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon
                  width={15}
                  height={15}
                  icon={faCircleCheck}
                ></FontAwesomeIcon>
              )}
            </div>
          </div>
          <div
            className="block sm:hidden text-blue-800 hover:underline cursor-copy text-xs py-2 flex flex-row items-center gap-1"
            onClick={handleCopy}
          >
            <p>
              {!changeCopyLinkFavicon ? copyMessage[mode][0] : "Copied!"}
            </p>
            {!changeCopyLinkFavicon ? (
              <FontAwesomeIcon
                width={15}
                height={15}
                icon={faLink}
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                width={15}
                height={15}
                icon={faCircleCheck}
              ></FontAwesomeIcon>
            )}
          </div>
        </div>
        <Link href={"/new-message"}>
          <div className={`${bounce}`} title="Send new message">
            <img
              width={30}
              height={30}
              alt="message-plus-icon"
              src="/new-message.svg"
            />
          </div>
        </Link>
      </div>
      {/**search images */}
      <div className="w-full pt-2 pb-4 px-1 xs:px-5">
        <SearchInput onChange={setFilterFor} value={filterFor} />
      </div>
      {/** contacts chat preview  */}
      {filterFor === "" ? (
        <div className="w-full overflow-x-none overflow-y-auto px-1 xs:px-5">
          {discussions.length !== 0 ? (
            discussions.map((data, index) => {
              return (
                <div
                  key={index}
                  className="w-full flex flex-col gap-4 pt-5 px-1 rounded-lg hover:bg-gray-200"
                >
                  <ChatPreview
                    mode={mode}
                    lastMessage={hex_to_string(
                      data[1][data[1].length - 1].text
                    )}
                    lastMessageTime={getTime(
                      data[1][data[1].length - 1].timestamp
                    )}
                    receiver={data[0]}
                    replied={
                      data[1][data[1].length - 1].from.toLowerCase() !==
                      address.toLowerCase()
                        ? true
                        : false
                    }
                    sender={address}
                  ></ChatPreview>
                  <div className="w-full  h-0.5 flex justify-end">
                    <div
                      className={`w-10/12 h-0.5 ${
                        index !== discussions.length - 1 && "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="pt-8 w-full flex justify-center gap-4">
              <p className="text-sm  font-light">No messages found yet..</p>
              <div>
                <Spinner size="md" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full overflow-x-none overflow-y-auto px-1 xs:px-5">
          {discussions.length !== 0 ? (
            discussions
              .filter(
                (data) =>
                  data[0].includes(filterFor) ||
                  (data[0].toLowerCase() === address.toLowerCase()
                    ? "myself".includes(filterFor)
                    : false)
              )
              .map((data, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex flex-col gap-4 pt-5 px-1 rounded-lg hover:bg-gray-200"
                  >
                    <ChatPreview
                      mode={mode}
                      lastMessage={hex_to_string(
                        data[1][data[1].length - 1].text
                      ).slice(5)}
                      lastMessageTime={getTime(
                        data[1][data[1].length - 1].timestamp
                      )}
                      receiver={data[0]}
                      replied={
                        data[1][data[1].length - 1].from !==
                        address.toLowerCase()
                          ? true
                          : false
                      }
                      sender={address}
                    ></ChatPreview>
                    <div className="w-full  h-0.5 flex justify-end">
                      <div
                        className={`w-10/12 h-0.5 ${
                          index !== discussions.length - 1 && "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="pt-8 w-full flex justify-center gap-4">
              <p className="text-sm  font-light">No messages found yet..</p>
              <div>
                <Spinner size="md" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatList;