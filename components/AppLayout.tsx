import React, { FunctionComponent, ReactNode, useState } from "react";
import { WalletModal } from "./Modal/WalletModal";
import Image from "next/image";
import { useWallet } from "@/hooks/use-wallet";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { shorten } from "@/lib/utils";
import { Network, networkLogo } from "@/lib/network";
import { NetworkModal } from "./Modal/NetworkModal";

interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openNetworkModal, setOpenNetworkModal] = useState(false);

  const { address, mode, appNetwork, walletNetwork } = useWallet();

  return (
    <div className={`${className}  flex flex-col justify-between h-screen bg-neutral-50 px-10 pt-10`}>
      <div className=" flex flex-row justify-between w-full">
        <div className="font-bold text-xl"> Text-Me Anon </div>
        <div className="flex items-center">
          {!!address ? (
            <>
                <button 
                  onClick={() => setOpenNetworkModal(true)}
                  className={`bg-white hover:bg-black rounded-lg p-2 mr-2 ${appNetwork !== walletNetwork ? 'bg-red-100' : ''}`}
                >
                  {
                    appNetwork === walletNetwork
                    ? <Image
                        width="36"
                        height="36"
                        alt="network logo"
                        src={networkLogo[appNetwork as Network]}
                      />
                    : <span className="font-semibold text-red-400">Change Network</span>
                  }
                </button>

              <button
                onClick={() => setOpenWalletModal(true)}
                className="flex items-center p-3 gap-2 rounded-xl shadow-2xl hover:bg-black hover:text-white"
              >
                {mode === "MetaMask" ? (
                  <Image
                    src="/logo/metamask-fox.svg"
                    alt="Metamask"
                    className="mx-2"
                    width="24"
                    height="24"
                  />
                ) : (
                  <Image
                    src="/logo/wallet-connect.svg"
                    alt="WalletConnect"
                    className="mx-2"
                    width="24"
                    height="24"
                  />
                )}
                <span className="font-medium text-highlighted text-lg">
                  {shorten(address)}
                </span>
                <FontAwesomeIcon className="h-4" icon={faCaretDown} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setOpenWalletModal(true)}
              className="px-3 py-2 text-black font-semibold text-lg rounded-xl shadow-2xl hover:bg-black hover:text-white"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-5/6 pt-5 px-10">
        {children}
      </div>
      <div className=" w-full h-12 pb-2 flex  text-right">
       <span className="self-end w-full"> Made by <a className="hover:underline text-blue-700" href="https://twitter.com/adeoluwami__">@Adeolu</a>   {`© 2023`}</span>
      </div>
      <WalletModal
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
      />
      <NetworkModal
        open={openNetworkModal}
        onClose={() => setOpenNetworkModal(false)}
      />
    </div>
  );
};
