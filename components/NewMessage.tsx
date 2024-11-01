import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Message } from "@/components/Message";
import { useAccount, useEnsName } from "wagmi";
import { isAddress } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { config } from "../wagmiConfig";
import { getAccount } from "@wagmi/core";


const NewMessage = () => {
  const router = useRouter();
  const [toAddress, setToAddress] = useState("");
  const [text, setText] = useState("");
  const [previewText, setPreviewText] = useState("");
  //tracks new msg entered by sender
  const [newMsg, setNewMsg] = useState(false);

  const { address } = useAccount();
  const { chainId } = getAccount(config);
  const chain = config.chains.find((chain) => chain.id === chainId);
  const { address: receiver } = router.query;

  const {
    data: ensName,
    error: error1,
    status: status1,
  } = useEnsName({
    address: isAddress(toAddress)
      ? (toAddress as `0x{string}`)
      : ("" as `0x{string}`),
    chainId: 1,
  });



  // resolved ensName or address
  const [resolvedName, resolvedAddress] = useMemo((): [
    string | undefined,
    string | undefined
  ] => {
    if (toAddress && ensName) {
      return [ensName, toAddress];
    } else if (isAddress(toAddress)) {
      return [undefined, toAddress];
    } else {
      return [undefined, undefined];
    }
  }, [ ensName, toAddress]);

  useEffect(() => {
    if (typeof receiver === "string") {
      setToAddress(receiver);
    }
  }, [receiver]);

  const handleAddrInput = (e: ChangeEvent<HTMLInputElement>) => {
    setToAddress(e.currentTarget.value);
  };

  return (
    <>
      {address ? (
        <div className="border shadow-2xl flex flex-col rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          {/**cancel button and page header */}
          <button onClick={() => router.back()}>
            <p className="absolute hover:underline px-1 text-xs xs:text-base xs:px-5 mt-4 xs:mt-8">
              Cancel
            </p>
          </button>
          <div className="flex flex-col gap-1 w-full rounded-t-3xl bg-gray-50  px-1 xs:px-5 py-7">
            <div className="flex justify-center items-center">
              <p className=" break-all font-bold text-sm xs:text-xl mt-8 sm:mt-0">
                New Message
              </p>
            </div>
          </div>
          {/** message recipient input field */}
          <div className="flex flex-col border-t">
            <div className="py-3 px-1 xs:px-5">
              <div className="flex flex-row items-center gap-2  ">
                <p className="font-bold">To:</p>
                <input
                  value={toAddress.toLowerCase()}
                  onChange={handleAddrInput}
                  placeholder={`input ${chain?.name} address`}
                  className="outline-none w-full h-8 break-all text-sm px-2"
                  type="text"
                ></input>
              </div>
              <div className="text-center text-xs text-red-600">
                {toAddress &&
                  !isAddress(toAddress) &&
                  !resolvedAddress &&
                  "This is not a valid address."}
              </div>
            </div>
            {resolvedName !== null &&
              toAddress !== undefined &&
              toAddress.length == 42 && (
                <div className="text-xs px-1 gap-2 xs:px-5 py-3">
                  <p className="font-light">
                    ENS name:
                    <span className="font-semibold">
                      {" " + resolvedName?.toLowerCase()}
                    </span>
                  </p>
                </div>
              )}
            <div className="w-full bg-gray-200 h-0.5"></div>
          </div>
          {/** show chat messages */}
          <div className="h-full overflow-x-none overflow-y-auto px-1 xs:px-5 py-3">
            {newMsg && (
              <div>
                <Message received={false} text={previewText}></Message>
              </div>
            )}
          </div>

          {/**show msg input text area */}
          {
            <div className="hidden lg:block">
              <TextInput
                text={text}
                enableOnKeydown={true}
                setText={setText}
                setNewMsg={setNewMsg}
                setPreviewText={setPreviewText}
                toAddress={toAddress}
              ></TextInput>
            </div>
          }
          {
            <div className="block lg:hidden">
              <TextInput
                text={text}
                enableOnKeydown={false}
                setText={setText}
                setNewMsg={setNewMsg}
                setPreviewText={setPreviewText}
                toAddress={toAddress}
              ></TextInput>
            </div>
          }
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            width={100}
            height={100}
          ></FontAwesomeIcon>
          <p className="text-center font-bold font-xl">
            Please connect wallet first
          </p>
        </div>
      )}
    </>
  );
};
export default NewMessage;
