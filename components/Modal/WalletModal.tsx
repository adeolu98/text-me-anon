import Image from 'next/image';
import React, { FunctionComponent } from 'react';

import { shorten } from '@/lib/utils';
import { useWallet } from '@/hooks/use-wallet';
import { ModalBase } from '@/components/Modal/ModalBase';


interface WalletModalProps {
  open: boolean;
  onClose: () => void;
};

export const WalletModal: FunctionComponent<WalletModalProps> = ({ open, onClose }) => {

  const { address, connect, mode, logout } = useWallet();

  const onSelectWallet = (walletType: 'MetaMask' | 'WalletConnect') => {
    console.log('Selected wallet: ', walletType);
    connect(walletType);
    onClose();
  };

  const onClickLogout = () => {
    logout();
    onClose();
  };

  return (
    <ModalBase title="Wallet Provider" open={open} onClose={onClose}>
      <p className="font-medium text-lg pb-4">
        Select your preferred wallet provider:
      </p>
      <button
        onClick={() => onSelectWallet('MetaMask')}
        className="py-3 px-4 flex items-center text-highlighted text-xl font-bold w-full bg-neutral-50 hover:bg-black hover:text-white rounded-3xl mb-4"
      >
        <span className="mr-5 relative p-2">
          <Image
            width="35"
            height="35"
            alt="Metamask log"
            src="/logo/metamask-fox.svg"
          />
          {
            mode === 'MetaMask' &&
            <div className="bg-green-400 w-2.5 h-2.5 rounded-full absolute top-0 right-0" />
          }
        </span>
        Metamask
      </button>

      <button
        onClick={() => onSelectWallet('WalletConnect')}
        className="py-3 px-4 flex items-center text-highlighted text-xl font-bold w-full bg-neutral-50 hover:bg-black hover:text-white rounded-3xl"
      >
        <span className="mr-5 relative p-2">
          <Image
            width="35"
            height="35"
            alt="Wallet Connect logo"
            src="/logo/wallet-connect.svg"
          />
          {
            mode === 'WalletConnect' &&
            <div className="bg-green-400 w-2.5 h-2.5 rounded-full absolute top-0 right-0" />
          }
        </span>
        WalletConnect
      </button>

      {address && (
        <>
          <div className="border-b border-gray-200 my-5" />

          <div className="flex justify-center items-center mb-5">
            <span>Currently connected with</span>
            {
              mode === 'MetaMask'
              ? <Image
                  width="24"
                  height="24"
                  alt="Metamask"
                  className="mx-2"
                  src="/logo/metamask-fox.svg"
                />
              : <Image
                  width="24"
                  height="24"
                  className="mx-2"
                  alt="WalletConnect"
                  src="/logo/wallet-connect.svg"
                />
            }
            <span className="text-highlighted font-semibold">
              {shorten(address)}
            </span>
          </div>

          <button
            onClick={onClickLogout}
            className="py-3 px-4 text-center text-black text-xl font-bold w-full bg-neutral-50 hover:bg-black hover:text-white hover:text-highlighted rounded-3xl"
          >
            Log out
          </button>
        </>
      )}
    </ModalBase>
  );
};
