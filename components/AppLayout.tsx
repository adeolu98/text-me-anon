import React, { FunctionComponent, ReactNode, useState } from "react";
import { WalletModal } from "./Modal/WalletModal";
import Image from 'next/image';
import { useWallet } from "@/hooks/use-wallet";

import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { shorten } from '@/lib/utils';
import { Network, networkLogo } from '@/lib/network';


interface AppLayoutProps {
  className?: string;
  children?: ReactNode;
}

export const AppLayout: FunctionComponent<AppLayoutProps> = ({
  className,
  children,
}) => {
  const [openWalletModal, setOpenWalletModal] = useState(false);

  const { address, mode, appNetwork, walletNetwork } = useWallet();

  const handleOpenWalletModal = () => {
    setOpenWalletModal(true)
  }

  return (
    <div className={`${className}  flex flex-col h-screen bg-neutral-50 p-6`}>
      <div className=" flex flex-row justify-between w-full">
        <div className="font-bold text-xl"> Text-Me Anon </div>
        <div className="flex items-center">
          {
            !!address
            ? <>

                <button
                  onClick={() => setOpenWalletModal(true)}
                  className="flex items-center p-3 gap-2 rounded-xl shadow-2xl hover:bg-black hover:text-white"
                >
                  {
                    mode === "MetaMask"
                    ? <Image
                        src="/logo/metamask-fox.svg"
                        alt="Metamask"
                        className="mx-2"
                        width="24"
                        height="24"
                      />
                    : <Image
                        src="/logo/wallet-connect.svg"
                        alt="WalletConnect"
                        className="mx-2"
                        width="24"
                        height="24"
                      />
                  }
                  <span className="font-medium text-highlighted text-lg">
                    {shorten(address)}
                  </span>
                  <FontAwesomeIcon className="h-4" icon={faCaretDown} />
                </button>
              </>
            : <button
                onClick={() => setOpenWalletModal(true)}
                className="px-3 py-2 text-black font-semibold text-lg rounded-xl shadow-2xl hover:bg-black hover:text-white"
              >
                Connect Wallet
              </button>
          }
        </div>
      </div>
      <div className="flex w-full justify-center items-center h-full pt-5 px-10 pb-10">
        {children}
      </div>
      <WalletModal
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
      />
    </div>
  );
};
