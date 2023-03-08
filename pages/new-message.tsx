import { TextInput } from "@/components/TextInput";
import { AppLayout } from "@/components/appLayout";
import { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const NewMessage: NextPage = () => {
  const [toAddress, setToAddress] = useState("");

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
              value={toAddress}
              onChange={ e => setToAddress(e.currentTarget.value)}
              className="outline-none w-full h-8 break-all text-sm px-2"
              type="text"
            ></input>
            {/* <input></input> */}
          </div>
          <div className="w-full bg-gray-200 h-0.5"></div>
        </div>
        {/** show chat messages */}
        <div className="h-full overflow-x-scroll px-1 xs:px-5 py-3"></div>

        {/**show msg input text area */}
        <TextInput toAddress={toAddress} ></TextInput>
      </div>
    </AppLayout>
  );
};
export default NewMessage;
