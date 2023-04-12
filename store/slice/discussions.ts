import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";
import { ethers } from "ethers";
import {TransactionResponse } from "@ethersproject/abstract-provider"
import { Discussion, DiscussionsState } from "@/lib/types";
import { Chain } from "wagmi";
import { Network, networks } from "@/lib/network";

//USE THIS TO FILTER THROUGH ALL TXS TO DIFFERENTIATE WHICH TXS ARE MESSAGE TXS
//THIS IS JUST "OCM:" WHEN HEXED. OCM = ON-CHAIN MESSAGE.
const msgTxIdentifier = "0x4f434d3a";

type TxResponse = TransactionResponse & {chainId: Network}

const fetchAllHistory = async (address: string): Promise<TxResponse[]> => {
  const getEtherscanProvider = (network: number) => new ethers.providers.EtherscanProvider(
    network
  );
  const etherScanProviders = networks
    .map(getEtherscanProvider)
  const settledNetworks: Network[] = []
  const _allHistory = (await Promise.allSettled(etherScanProviders.map(provider => provider.getHistory(address))))
    .filter((result, index) => {
      if(result.status === "rejected"){
        console.error(result.reason)
        return false
      }
      settledNetworks.push(networks[index])
      return true;
    })
    .map((result, index) => {
        const txs = (result as PromiseFulfilledResult<TxResponse[]>).value;
        return txs.map((tx: TxResponse) => ({...tx, chainId: settledNetworks[index]}))
      }
    )

  const allHistory: TxResponse[] = []
  return allHistory.concat(..._allHistory)
}

export const fetchDiscussions = createAsyncThunk(
  "discussions/fetchDiscussions",
  async ({
    address,
  }: {
    address: string;
  }) => {
    const history = await fetchAllHistory(address);
    const discussions: {[key: string]: Discussion[]} = {};
    const filtered = history.filter((tx) => tx.data.includes(msgTxIdentifier));

    filtered.forEach(async (data) => {
      const discussion = {
          from: data.from.toLowerCase(),
          to: data.to!.toLowerCase(),
          text: data.data,
          timestamp: data.timestamp!,
          id: data.chainId,
          hash: data.hash
        }
      
      // when address is sender and receiver
      if(data.from.toLowerCase() === address.toLowerCase() && 
        data.to?.toLowerCase() === address.toLowerCase()){
          if(!discussions[address.toLowerCase()])  
            discussions[address.toLowerCase()]= []
          discussions[address.toLowerCase()].push(discussion)
      }
      // when address receives a message
      else if(data.from.toLowerCase() !== address.toLowerCase()){
        if(!discussions[data.from.toLowerCase()])  
          discussions[data.from.toLowerCase()]= []
        discussions[data.from.toLowerCase()].push(discussion)
      }
      // when address sends a message
      else if(data.to && data.to.toLowerCase() !== address.toLowerCase()){
        if(!discussions[data.to.toLowerCase()]) 
          discussions[data.to.toLowerCase()]= []
        discussions[data.to.toLowerCase()].push(discussion)
      }
    });

    return {[address]: discussions};
  }
);

function getInitialState() {
  const initialState: DiscussionsState = {};

  return initialState;
}

export const discussionsSlice = createSlice({
  name: "discussions",
  initialState: getInitialState(),
  reducers: {
    resetDiscussions: () => {
      return {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDiscussions.fulfilled, (state, action) => ({...state, ...action.payload}));
  },
});

export const { resetDiscussions } = discussionsSlice.actions;

type selectDiscussions = (state: AppState) => DiscussionsState;

export const selectDiscussions: selectDiscussions = (state: AppState) =>
  state.discussions;

export default discussionsSlice.reducer;
