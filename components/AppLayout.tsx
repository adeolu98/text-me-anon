import React, { FunctionComponent, ReactNode } from "react";
import { ChatSearch } from "./SearchInput";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import ModeSwitch from "./ModeSwitch";
import { useSelector } from "react-redux";
import { selectMode } from "@/store/slice/general";
import { ChatMode } from "@/lib/types";
import AnonLogo from "@/public/anon.svg";

interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  const { asPath } = useRouter();
  const { isConnected } = useAccount();
  const mode = useSelector(selectMode);

  return (
    <div
      className={`${className}  flex flex-col justify-between h-full w-full bg-neutral-50 px-4 xs:px-6 sm:px-10 pt-10`}
    >
      <Head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </Head>
      <div className=" flex flex-row justify-between gap-6 w-full">
        <div className="font-bold flex-shrink-0 text-lg sm:text-xl md:text-2xl items-center md:gap-1 flex flex-row">
          <Image width={40} height={10} src={AnonLogo} alt="" />
          <p className="pl-3 hidden md:block">Text-Me-Anon</p>
          <div className=" hidden sm:block text-xs self-start break-all text-center">
            {mode === ChatMode.CHAT ? "chat mode" : "watch mode"}
          </div>
        </div>

        <div className="items-center flex-shrink-0 flex">
          <div className="flex-shrink-0 hidden sm:flex items-center mr-4">
            <ModeSwitch />
          </div>
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
      </div>

      <div
        className={`flex ${
          mode === ChatMode.CHAT || "/watch/" === asPath
            ? "justify-end"
            : "justify-center"
        } items-center`}
      >
        {"/watch/" !== asPath && mode === ChatMode.WATCH && (
          <ChatSearch classNames="block mx-auto" />
        )}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div className="sm:hidden flex-shrink-0">
          <ModeSwitch />
        </div>
      </div>

      <div className="flex w-full justify-center items-center h-full">
        {children}
      </div>
      <div className=" w-full pt-2 sm:pt-0 pb-2 flex gap-4 flex-row">
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
      </div>
    </div>
  );
};
