import { hex_to_string, getTime, shorten } from "@/lib/utils";
import { Spinner } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { ChatPreview } from "./ChatPreview";
import SearchInput from "./SearchInput";
import { useDiscussions } from "@/hooks/use-discussions";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import { useEnsAddress } from "wagmi";
import { ChatMode, FetchStatus } from "@/lib/types";
import Copy from "./Copy";
import { selectChatOpened, setChatOpened } from "@/store/slice/general";
import { useAppDispatch, useAppSelector } from "@/store";

interface ChatListProps {
  address: string;
  mode: ChatMode;
  ensNameForAddress?: string | null;
}

function ChatList(props: ChatListProps) {
  const { address, mode, ensNameForAddress } = props;
  const [bounce, setBounce] = useState("");
  const [filterFor, _setFilterFor] = useState("");
  const chatOpened = useAppSelector(selectChatOpened);
  const dispatch = useAppDispatch();

  const {
    discussions: _discussions,
    fetchStatus,
    loaded,
  } = useDiscussions(address);

  //sort in descending order of timestamp
  const discussions = Object.entries(_discussions || []).sort(
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

  useEffect(() => {
    address && discussions.length === 0 ? startBounce() : setBounce("");
  }, [address, discussions]);

  useEffect(() => {
    handleClickScroll();
  }, []);

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

  useEffect(() => {
    handleClickScroll();
  }, []);

  const handleClickScroll = () => {
    const element = document.getElementById("lastOpened");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const _setChatOpened = (address: string) => {
    dispatch(setChatOpened(address));
  };

  return (
    <div className="border shadow-2xl py-8 flex flex-col rounded-3xl h-full w-full sm:w-4/6 lg:w-3/6 xl:w-2/6">
      {/**top section with create new message icon */}
      <div className="flex flex-col xs:flex-row justify-between px-1 xs:px-5">
        <div className="flex-flex-col">
          <div className="text-xs xs:text-base sm:text-xl font-bold">
            {mode === ChatMode.CHAT
              ? "Your Messages"
              : !ensNameForAddress
              ? `Messages for ${shorten(address ?? "")}`
              : `Messages for ${ensNameForAddress}`}
          </div>
          <div className="hidden sm:block">
            <Copy
              onCopyText="Copied! Now share it with other anons"
              defaultText={
                mode === ChatMode.WATCH
                  ? "Click to copy this address link"
                  : "Click to copy your address link"
              }
              copyText={`${
                window.location.origin
              }/${mode}/${address?.toLowerCase()}`}
            />
          </div>
          <div className="block sm:hidden">
            <Copy
              onCopyText="Copied!"
              defaultText={
                mode === ChatMode.WATCH
                  ? "Copy this address link"
                  : "Copy your address link"
              }
              copyText={`${
                window.location.origin
              }/${mode}/${address?.toLowerCase()}`}
            />
          </div>
        </div>
        <Link href={`/new-message/${mode === ChatMode.WATCH ? address : ""}`}>
          <div
            className={`${bounce}`}
            title={
              mode === ChatMode.CHAT
                ? "Send new message"
                : `Send ${
                    ensNameForAddress ? ensNameForAddress : shorten(address)
                  } a message`
            }
          >
            <Image
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
                  onClick={() => _setChatOpened(data[0])}
                  id={chatOpened === data[0] ? "lastOpened" : ""}
                >
                  <ChatPreview
                    ensNameForAddress={ensNameForAddress}
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
              {fetchStatus === FetchStatus.PENDING && !loaded ? (
                <>
                  <p className="text-sm  font-light">No messages found yet..</p>
                  <div>
                    <Spinner size="md" />
                  </div>
                </>
              ) : (
                <p className="text-sm  font-light">No messages found</p>
              )}
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
                    onClick={() => _setChatOpened(data[0])}
                    id={chatOpened === data[0] ? "lastOpened" : ""}
                  >
                    <ChatPreview
                      ensNameForAddress={ensNameForAddress}
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
              {fetchStatus === FetchStatus.PENDING && !loaded ? (
                <div>
                  <p className="text-sm  font-light">No messages found yet..</p>
                  <div>
                    <Spinner size="md" />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm  font-light">No messages found</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatList;
