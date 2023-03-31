import { ChatPreview } from "@/components/ChatMsgsPreview";
import { AppLayout } from "@/components/AppLayout";
import { NextPage } from "next";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircleExclamation, faLink } from "@fortawesome/free-solid-svg-icons";
import { useDiscussions } from "@/hooks/use-discussions";
import { getTime, hex_to_string } from "@/lib/utils";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useEnsAddress } from "wagmi";
import { networkNames } from "@/lib/network";
import { useRouter } from "next/router";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [bounce, setBounce] = useState("");

  const [filterFor, setFilterFor] = useState("");
  const [currentMsgsChain, setCurrentMsgsChain] = useState<
    number | undefined
  >();
  const [changeCopyLinkFavicon, setChangeCopyLinkFavicon] = useState(false);
  const router = useRouter();
  //sort in descending order of timestamp
  const discussions = Object.entries(useDiscussions()).sort(
    (a, b) => b[1][b[1].length - 1].timestamp - a[1][a[1].length - 1].timestamp
  );

  useEffect(() => {
    address && discussions.length === 0 ? startBounce() : setBounce("");
    discussions[0] &&
      discussions[0][1][0] &&
      setCurrentMsgsChain(discussions[0][1][0].id);
  }, [address, discussions]);

  const startBounce = () => {
    setTimeout(() => {
      setBounce("animate-bounce");
    }, 10000);
  };

  const { data } = useEnsAddress({
    name: filterFor,
  });

  useEffect(() => {
    if (data) setFilterFor(data.toLowerCase());
  }, [filterFor]);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/chat/${address?.toLowerCase()}`
    );
    setChangeCopyLinkFavicon(true);

    setTimeout(() => {
      setChangeCopyLinkFavicon(false);
    }, 2000);
  };

  return (
    <AppLayout>
      {address ? (
        <div className="border shadow-2xl py-8 flex flex-col rounded-3xl h-full w-full sm:w-4/6 lg:w-3/6 xl:w-2/6">
          {/**top section with create new message icon */}
          <div className="flex flex-col xs:flex-row justify-between px-1 xs:px-5">
            <div className="flex-flex-col">
              <div className="text-xs xs:text-base sm:text-xl font-bold">
                Messages
                {currentMsgsChain && ` on ${networkNames[currentMsgsChain!]}`}
              </div>
              <div
                className="hover:underline cursor-copy text-xs py-2 flex flex-row items-center gap-1"
                onClick={handleCopy}
              >
                <p>{!changeCopyLinkFavicon ? 'Click to copy your address link' : 'Copied! Now share it with other anons'}</p>
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
                  src="https://img.icons8.com/ios/50/null/new-message.png"
                />
              </div>
            </Link>
          </div>
          {/**search images */}
          <div className="w-full pt-2 pb-4 px-1 xs:px-5">
            <input
              value={filterFor.toLowerCase()}
              type="text"
              className=" w-full border focus:bg-gray-100 rounded-xl px-4 py-2 focus:border-2 focus:border-black focus:outline-none"
              placeholder="search"
              onChange={(e) =>
                setFilterFor(
                  e.currentTarget.value.toLowerCase() === address.toLowerCase()
                    ? "myself"
                    : e.currentTarget.value.toLowerCase()
                )
              }
            ></input>
          </div>
          {/** contacts chat preview  */}
          {filterFor === "" ? (
            <div className="w-full overflow-x-scroll px-1 xs:px-5">
              {discussions.length !== 0 ? (
                discussions.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex flex-col gap-4 pt-5 px-1 rounded-lg hover:bg-gray-200"
                    >
                      <ChatPreview
                        lastMessage={hex_to_string(
                          data[1][data[1].length - 1].text
                        ).slice(5)}
                        lastMessageTime={getTime(
                          data[1][data[1].length - 1].timestamp
                        )}
                        contactAddr={data[0]}
                        replied={
                          data[1][data[1].length - 1].from.toLowerCase() !==
                          address.toLowerCase()
                            ? true
                            : false
                        }
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
                    <Spinner size={"md"} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-scroll px-1 xs:px-5">
              {discussions.length !== 0 ? (
                discussions
                  .filter((data) => data[0] === filterFor)
                  .map((data, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full flex flex-col gap-4 pt-5 px-1 rounded-lg hover:bg-gray-200"
                      >
                        <ChatPreview
                          lastMessage={hex_to_string(
                            data[1][data[1].length - 1].text
                          ).slice(5)}
                          lastMessageTime={getTime(
                            data[1][data[1].length - 1].timestamp
                          )}
                          contactAddr={data[0]}
                          replied={
                            data[1][data[1].length - 1].from !==
                            address.toLowerCase()
                              ? true
                              : false
                          }
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
export default Home;
