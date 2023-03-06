
import type { providers, Signer } from 'ethers';

import type { Network } from '@/lib/network';


export interface UserState {
  appNetwork: Network;

  mode?: 'MetaMask' | 'WalletConnect';

  /** Current user wallet address, if `undefined` the user is not connected */
  address?: string;
  /**
   * Current user wallet network, if `undefined` the user is not connected,
   *
   * **most of the time we shouldn't use this and use `appNetwork` instead**.
   *
   * This is use to check if the wallet as the same network as the app,
   * to sync the app network when the user change the network on it's wallet
   * and to warn the user if he selected an unsupported network on it's wallet.
   */
  walletNetwork?: number;
  provider?: providers.Web3Provider;
  signer?: Signer;
};

