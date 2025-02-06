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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faLink } from "@fortawesome/free-solid-svg-icons";
import Demo1 from "@/public/demo1.gif";
import Demo2 from "@/public/demo2.gif";
import one from "@/public/one.svg";
import two from "@/public/two.svg";
import three from "@/public/three.svg";
import four from "@/public/four.svg";

import { ConnectButton } from "@rainbow-me/rainbowkit";

interface LandingPageProps {
  address: string;
  mode: ChatMode;
  ensNameForAddress?: string | null;
}

function LandingPage() {
  return (
    <div className="flex flex-col gap-20">
      <div className="h-full w-full flex flex-col md:flex-row gap-10">
        <div className=" w-full md:w-3/5  text-left  flex flex-col md:items-left gap-10 ">
          <p className=" pt-10 lg:pt-20 font-black text-3xl lg:text-6xl lg:pr-36">
            Send On-Chain Messages—No Code, No Hassle.
          </p>
          <p className="font-normal text-xl lg:text-2xl">
            Say goodbye to scripts and hexdata! Instantly send messages to any
            wallet address on chain—all from one simple dApp.
          </p>
          <ConnectButton
            showBalance={{
              smallScreen: false,
              largeScreen: false,
            }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          ></ConnectButton>
        </div>
        <div className="md:w-2/5 place-content-center">
          <Image src={Demo1} className="w-full" alt="demo gif 1"></Image>
        </div>
      </div>

      {/** SCREEN 2 */}
      <div className="h-full w-full flex flex-col md:flex-row gap-10">
        <div className=" w-full md:w-3/5  text-left  flex flex-col md:items-left gap-10 ">
          <div className="pt-10 lg:pr-36">
            <p className="border border-gray-300 p-2 w-max rounded-xl text-sm font-medium ">
              How it works
            </p>
            <p className="font-bold text-3xl lg:text-6xl pt-5">
              Getting started with Text-Me Anon
            </p>
          </div>
          <p className="font-normal text-xl lg:text-2xl pr-32">
            Sending on-chain messages has never been easier. With Text-Me Anon,
            you can send messages to other addresses just like sending a tx.
            Here’s how it works:
          </p>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-5">
              <Image src={one} alt="one-icon"></Image>
              <p className="font-normal text-xl lg:text-2xl">
                Connect Your Wallet
              </p>
            </div>
            <div className="flex flex-row gap-5">
              <Image src={two} alt="one-icon"></Image>
              <p className="font-normal text-xl lg:text-2xl">
                Choose an Address
              </p>
            </div>
            <div className="flex flex-row gap-5">
              <Image src={three} alt="one-icon"></Image>
              <p className="font-normal text-xl lg:text-2xl">Write & Send </p>
            </div>
            <div className="flex flex-row gap-5">
              <Image src={four} alt="one-icon"></Image>
              <p className="font-normal text-xl lg:text-2xl">
                View Your History
              </p>
            </div>
          </div>
        </div>
        <div className="md:w-2/5  place-content-center ">
          <Image src={Demo2} className="w-full" alt="demo gif 1"></Image>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
