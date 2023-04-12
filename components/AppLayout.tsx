import React, { ChangeEvent, FunctionComponent, ReactNode, FocusEvent, KeyboardEvent, useMemo, useState, useCallback, FocusEventHandler } from "react";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faDiscord } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import SearchInput from "./SearchInput";
import { buildDataUrl } from "@/utils/helperFunctions";
import { useEnsAddress, useEnsName } from "wagmi";
import { isAddress } from "ethers/lib/utils.js";
import { useRouter } from "next/router";

interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  const [search, setSearch] = useState("")
  const [searchFocus, setSearchFocus] = useState<boolean>(false)

  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  }
  const router = useRouter()

  const { data: ensName, error: error1, status: status1 } = useEnsName({
    address: isAddress(search) ? search : ("" as `0x{string}`),
    chainId: 1
  });
  const {data: ensAddress, error, status} = useEnsAddress({
    name: search,
    chainId: 1
  })

  // resolved ensName or address
  const [name, address]  = useMemo((): [string|undefined, string|undefined] => {
    if(search && ensName){
      return [ensName, search]
    }else if(search && ensAddress){
      return [search, ensAddress]
    } else if(isAddress(search)){
      return [undefined, search]
    } else {
      return [undefined, undefined]
    }
  }, [ensAddress, ensName, search])

  const watchAddress = useCallback(() => {
    if(address) router.push(`/watch/${address}`)
  }, [address, router])

  const validateKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      watchAddress();
    }
  }, [watchAddress])

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
        <div className="font-bold flex-shrink-0 text-lg sm:text-xl md:text-2xl items-center md:gap-1 flex flex-row">
          <p className="">Text-Me Anon</p>
          <Image width={30} height={10} src="/anon.ico" alt="" />
        </div>
        <div className="max-w-[500px] relative w-full flex items-center md:w-96">
          <SearchInput
            value={search}
            onChange={handleSearchInput}
            placeholderText="Search address chat"
            onKeyDown={validateKey}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
          {search && searchFocus && (
            <div className="flex absolute p-2 w-full bg-white rounded-xl bottom-0 translate-y-[115%] items-center cursor-pointer">
              {!name || !address ? (
                <span className="w-full text-center inline-block">
                  No result
                </span>
              ) : (
                <button className="flex w-full items-center bg-neutral-50 p-[5px] rounded-xl" onClick={watchAddress}>
                  <span className="inline-block flex-shrink-0 w-[20px] h-[20px] relative ">
                    <Image
                      fill
                      src={buildDataUrl(address)}
                      alt=""
                      className="rounded-full"
                    />
                  </span>
                  &nbsp;&nbsp;
                  <span className="overflow truncate">{name || address}</span>
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center flex-shrink-0">
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
