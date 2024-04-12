"use client"; //adding this as fix (temp fix maybe) to solve the recurring hydration error. It is triggered by a third party library and this workaround solves it.

import { AppLayout } from "@/components/AppLayout";
import { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useAccount, useEnsName } from "wagmi";
import ReactGA from "react-ga";
import ChatList from "@/components/ChatList";
import { ChatMode } from "@/lib/types";
import { useEffect, useState } from "react";

ReactGA.initialize("UA-262892775-1");

const Home: NextPage = () => {
  const { address } = useAccount();
  const { data } = useEnsName({
    address: `0x${address?.slice(2) as string}`,
    chainId: 1,
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); //part of fix for hydration error

  return (
    <div>
      <AppLayout>
        {address && isClient ? (
          <ChatList
            ensNameForAddress={data}
            mode={ChatMode.CHAT}
            address={address}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center flex-col gap-10 sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              width={100}
              height={100}
            ></FontAwesomeIcon>
            <p className="text-center font-bold font-xl">
              Please connect wallet to see your on-chain messages
            </p>
          </div>
        )}
      </AppLayout>
    </div>
  );
};

export default Home;
