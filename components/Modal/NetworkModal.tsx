import Image from 'next/image';
import React, { FunctionComponent } from 'react';

import { useWallet } from '@/hooks/use-wallet';
import { ModalBase } from '@/components/Modal/ModalBase';
import { Network, networkLogo, networkNames, networks, isNetworkSupported } from '@/lib/network';


interface NetworkModalProps {
  open: boolean;
  onClose: () => void;
};

export const NetworkModal: FunctionComponent<NetworkModalProps> = ({ open, onClose }) => {

  const { appNetwork, switchAppNetwork } = useWallet();

  const onSelectNetwork = async (networkType: Network) => {
    if (!isNetworkSupported(networkType)) return;
    
    await switchAppNetwork(networkType)
    onClose();
  };

  return (
    <ModalBase title="Select Network" onClose={onClose} open={open}>
      {networks.map((network, index) => (
        <button
          key={index}
          onClick={() => onSelectNetwork(network)}
          className="py-3 px-4 h-20 flex items-center text-highlighted text-xl font-bold w-full bg-neutral-50 hover:bg-black hover:text-white rounded-3xl mb-4"
        >
          <span className="mr-5 relative p-2">
            <Image
              width="35"
              height="35"
              alt="network"
              src={networkLogo[network]}
            />
            {network === appNetwork && (
              <div className="bg-green-400 w-2.5 h-2.5 rounded-full absolute top-0 right-0" />
            )}
          </span>
          <span>{networkNames[network]}</span>
        </button>
      ))}
    </ModalBase>
  );
};
