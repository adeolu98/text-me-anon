import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";
import { ethers } from "ethers";
import { Discussion, DiscussionsState, TxResponse } from "@/lib/types";
import { Network, networks } from "@/lib/network";
import getHistory from "@/lib/getHistory";
import txFilter from "@/lib/txFilter";

//USE THIS TO FILTER THROUGH ALL TXS TO DIFFERENTIATE WHICH TXS ARE MESSAGE TXS
//THIS IS JUST "OCM:" WHEN HEXED. OCM = ON-CHAIN MESSAGE.
const msgTxIdentifier = "0x4f434d3a";

const fetchAllHistory = async (address: string): Promise<TxResponse[]> => {
  const getEtherscanProvider = (network: number) => new ethers.providers.EtherscanProvider(
    network
  );
  const etherScanProviders = networks
    .map(getEtherscanProvider)

  const _allHistory = (await Promise.allSettled(etherScanProviders.map((provider, index) => getHistory(provider, address, networks[index]))))
    .filter((result) => {
      if(result.status === "rejected"){
        console.error(result.reason)
        return false
      }
      return true;
    })
    .map((result) => {
        const txs = (result as PromiseFulfilledResult<TxResponse[]>).value;
        return txs
      }
    )
    
  console.log(_allHistory)
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
    const filtered = history.filter((tx) => txFilter(tx));

    filtered.forEach(async (data) => {
      const message = {
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
          discussions[address.toLowerCase()].push(message)
      }
      // when address receives a message
      else if(data.from.toLowerCase() !== address.toLowerCase()){
        if(!discussions[data.from.toLowerCase()])  
          discussions[data.from.toLowerCase()]= []
        discussions[data.from.toLowerCase()].push(message)
      }
      // when address sends a message
      else if(data.to && data.to.toLowerCase() !== address.toLowerCase()){
        if(!discussions[data.to.toLowerCase()]) 
          discussions[data.to.toLowerCase()]= []
        discussions[data.to.toLowerCase()].push(message)
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
