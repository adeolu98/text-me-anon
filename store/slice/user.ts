
import { providers, Signer } from 'ethers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '@/store';
import type { UserState } from '@/lib/types';
import { DEFAULT_NETWORK, Network } from '@/lib/network';


const initialState: UserState = {
  appNetwork: DEFAULT_NETWORK,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connect: (
      state,
      action: PayloadAction<{
        provider: providers.Web3Provider;
        mode: 'MetaMask' | 'WalletConnect';
        address: string;
        signer: Signer;
        walletNetwork: number;
      }>
    ) => {
      state.mode = action.payload.mode;
      state.provider = action.payload.provider;
      state.address = action.payload.address;
      state.signer = action.payload.signer;
      state.walletNetwork = action.payload.walletNetwork;
    },
    setAppNetwork: (state, action: PayloadAction<{ appNetwork: Network }>) => {
      state.appNetwork = action.payload.appNetwork;
    },
    setWalletNetwork: (state, action: PayloadAction<{ walletNetwork: number }>) => {
      state.walletNetwork = action.payload.walletNetwork;
    },
    setAddress: (state, action: PayloadAction<{ address: string }>) => {
      state.address = action.payload.address;
    },
    disconnect: state => {
      state.mode = undefined;
      state.address = undefined;
      state.provider = undefined;
      state.signer = undefined;
      state.walletNetwork = undefined;
    },
  },
});

export const {
  connect,
  setAppNetwork,
  setWalletNetwork,
  setAddress,
  disconnect,
} = userSlice.actions;

type selectUser = (state: AppState) => UserState;

export const selectUser: selectUser = (state: AppState) => state.user;

export default userSlice.reducer;
