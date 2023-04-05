import React, { FunctionComponent, ReactNode } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

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
      <div className="flex w-full justify-center items-center h-5/6 pt-5 md:px-10">
        {children}
      </div>
      <div className=" w-full pt-2 sm:pt-0 xs:h-12 pb-2 flex  text-right">
        <span className="self-end w-full">
          {"Made by "}
          <a
            className="hover:underline text-blue-700"
            href="https://twitter.com/adeoluwami__"
          >
            @Adeolu
          </a>
          {` © 2023`}
        </span>
      </div>
    </div>
  );
};
