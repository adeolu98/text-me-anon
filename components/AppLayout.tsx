import React, { FunctionComponent, ReactNode } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`${className}  flex flex-col justify-between h-screen bg-neutral-50 px-4 xs:px-6 sm:px-10 pt-10`}
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
        <div className="font-bold text-lg sm:text-xl md:text-2xl items-center md:gap-1 flex flex-row">
          <p className="">Text-Me Anon</p>
          <Image width={30} height={10} src="/anon.ico" alt="" />
        </div>
        <div className="flex items-center">
          <ConnectButton
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          ></ConnectButton>
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-4/5 pt-5 md:px-10">
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
