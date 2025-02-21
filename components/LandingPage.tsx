import Image from "next/image";
import { ChatSearch } from "./SearchInput";
import { ChatMode } from "@/lib/types";

import Demo1 from "@/public/demo1.gif";
import Demo2 from "@/public/demo2.gif";
import Demo3 from "@/public/demo3.gif";
import one from "@/public/one.svg";
import two from "@/public/two.svg";
import three from "@/public/three.svg";
import four from "@/public/four.svg";
import multi_mobile from "@/public/multi-mobile.svg";
import noScripts_mobile from "@/public/noscripts-mobile.svg";
import onchain_mobile from "@/public/onchain-mobile.svg";
import instant_mobile from "@/public/instant-mobile.svg";
import multi from "@/public/multi.svg";
import noScripts from "@/public/noScripts.svg";
import onchain from "@/public/on-chain.svg";
import instant from "@/public/instant.svg";

import instant_w from "@/public/instant-w.svg";
import privateSVG from "@/public/private.svg";
import smart from "@/public/smart.svg";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import FAQAccordion from "./FAQAccordion";
import AnonLogo from "@/public/anon.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface LandingPageProps {
  mode: ChatMode;
}

function LandingPage(props: LandingPageProps) {
  const { mode } = props;

  return (
    <div className="flex flex-col pt-10 gap-20">
      <div className="h-full w-full flex flex-col md:flex-row gap-10">
        <div className=" w-full md:w-3/5  text-left  flex flex-col md:items-left gap-10 ">
          <p className=" pt-10 lg:pt-20 font-black text-3xl lg:text-6xl lg:pr-36">
            {mode == ChatMode.CHAT
              ? "Send On-Chain Messages—No Code, No Hassle."
              : "View On-Chain Messages—No Code, No Hassle "}
          </p>
          <p className="font-normal text-xl lg:text-2xl">
            {mode == ChatMode.CHAT
              ? "Say goodbye to scripts and hex data! Instantly send messages to any wallet address on-chain—all from one easy-to-use dApp."
              : "Say goodbye to following conversations on blockchain explorers! Instantly view messages and follow the most interesting conversations — all from one easy-to-use dApp."}
          </p>
          {mode == ChatMode.CHAT ? (
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
          ) : (
            <div>
              <p className="text-left font-semibold font-xl mb-2 mt-10">
                Enter an address below to view its on-chain messages
              </p>
              <ChatSearch
                placeholder="0x or ENS"
                classNames="w-full lg:w-2/4 max-w-full"
              />
            </div>
          )}
        </div>
        <div className="md:w-2/5 place-content-center">
          {mode == ChatMode.CHAT ? (
            <Image src={Demo1} className="w-full" alt="demo gif 1"></Image>
          ) : (
            <Image src={Demo3} className="w-full" alt="demo gif 3"></Image>
          )}
        </div>
      </div>

      {/** SCREEN 2 */}
      <div className="h-full w-full flex flex-col md:flex-row gap-10">
        <div className=" w-full md:w-3/5  text-left  flex flex-col md:items-left gap-10 ">
          <div className="pt-10 lg:pr-36" id="HowItWorks">
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

      {/** SCREEN 3 */}
      <div className="h-full w-full flex flex-col gap-10">
        <div className="w-full md:w-3/5  text-left  flex flex-col md:items-left gap-10">
          <div className="pt-10 lg:pr-36" id="Why">
            <p className="font-bold text-3xl lg:text-6xl pt-5">
              Why Use Text-Me Anon?
            </p>
          </div>
          <p className="font-normal text-xl lg:text-2xl lg:pr-32">
            With Text-Me Anon, messaging on-chain is effortless, secure, and
            decentralized. Here’s why you’ll love it:
          </p>
        </div>
        <div className="w-full  flex flex-col gap-10">
          <div className="w-full flex flex-col sm:flex-row justify-between gap-8 xl:h-1/2">
            <div className="w-full xl:w-max">
              <Image
                className="w-full block lg:hidden"
                src={multi_mobile}
                alt="multi-svg"
              />
              <Image
                className="w-full hidden lg:block"
                src={multi}
                alt="multi-svg"
              />
            </div>

            <div className="w-full  xl:w-max">
              <Image
                className="w-full block lg:hidden"
                src={noScripts_mobile}
                alt="multi-svg"
              />
              <Image
                className="w-full hidden lg:block"
                src={noScripts}
                alt="multi-svg"
              />
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between gap-8 xl:h-1/2">
            <div className="w-full xl:w-max">
              <Image
                className="w-full block lg:hidden"
                src={onchain_mobile}
                alt="multi-svg"
              />
              <Image
                className="w-full hidden lg:block"
                src={onchain}
                alt="multi-svg"
              />
            </div>

            <div className="w-full xl:w-max">
              <Image
                className="w-full block lg:hidden"
                src={instant_mobile}
                alt="multi-svg"
              />
              <Image
                className="w-full hidden lg:block"
                src={instant}
                alt="multi-svg"
              />
            </div>
          </div>
        </div>
      </div>

      {/** SCREEN 4 */}
      <div className=" h-full w-full flex flex-col gap-10">
        <div className="w-full  text-center  flex flex-col items-center gap-6">
          <div className=" w-4/6 lg:w-2/6" id="UseCases">
            <p className="font-bold text-3xl lg:text-6xl pt-5">
              Use Cases For Text-Me Anon
            </p>
          </div>
          <p className="font-normal text-xl w-4/6 lg:w-2/6 lg:text-2xl">
            Here are the various ways you can make use of Text-Me Anon
          </p>
        </div>

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 sm:gap-6 justify-between">
          <Image className="w-full" src={instant_w} alt="instant-w-svg" />
          <Image className="w-full" src={privateSVG} alt="private.svg" />
          <Image className="w-full" src={smart} alt="smart.svg" />
        </div>
      </div>
      {/** SCREEN 5 */}
      <div className="flex flex-col gap-10 justify-start w-4/5 pt-10">
        <div
          className="font-bold text-3xl lg:text-6xl lg:w-3/5 w-4/5 pt-5"
          id="FAQ"
        >
          <p>Frequently Asked Questions (FAQs)</p>
        </div>
        <FAQAccordion />
      </div>

      {/** bottom */}
      <div className="w-full flex flex-col gap-10 lg:gap-0 lg:flex-row items-center lg:justify-between pt-16 pb-6">
        <div className="font-bold flex-shrink-0 text-lg sm:text-xl  items-center md:gap-1 flex flex-row">
          <Image width={30} height={10} src={AnonLogo} alt="" />
          <p className="pl-3">Text-Me-Anon</p>
        </div>

        <div className="flex flex-row gap-5 font-semibold">
          <a className="hover:underline" href="#HowItWorks">
            How it Works
          </a>
          <a className="hover:underline" href="#Why">
            Why us
          </a>
          <a className="hover:underline" href="#UseCases">
            Use Cases
          </a>
          <a className="hover:underline" href="#FAQ">
            FAQ
          </a>
        </div>

        <div className="flex gap-4 flex-row">
          <a
            className="hover:underline text-black"
            href="https://twitter.com/textmeanon"
            target="__blank"
          >
            <FontAwesomeIcon
              width={20}
              height={20}
              icon={faTwitter as IconProp}
            ></FontAwesomeIcon>
          </a>
          <a
            className="hover:underline text-black"
            href="https://discord.gg/nmtJbFjPK9"
            target="__blank"
          >
            <FontAwesomeIcon
              width={20}
              height={20}
              icon={faDiscord as IconProp}
            ></FontAwesomeIcon>
          </a>
          <a
            className="hover:underline text-black"
            href="mailto:contact.textmeanon@gmail.com"
            target="__blank"
          >
            <FontAwesomeIcon
              width={20}
              height={20}
              icon={faGoogle as IconProp}
            ></FontAwesomeIcon>
          </a>
        </div>
      </div>
      <div className="pb-8">
        <p className="text-sm">
          © {new Date().getFullYear()} TStore Labs. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
