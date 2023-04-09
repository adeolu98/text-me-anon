import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";
import { ethers } from "ethers";
import {TransactionResponse } from "@ethersproject/abstract-provider"
import { DiscussionsState } from "@/lib/types";
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
    network,
    userAddress,
  }: {
    network: (Chain & { unsupported?: boolean | undefined }) | undefined;
    userAddress: string;
  }) => {
    const history = await fetchAllHistory(userAddress);
    const discussions = getInitialState();
    const filtered = history.filter((tx) => tx.data.includes(msgTxIdentifier));

    filtered.forEach(async (data) => {
      //for instances where messages are sent to self
      if (data.from.toLowerCase() === data.to!.toLowerCase()) {
        discussions["myself"] === undefined
          ? (discussions["myself"] = [
              {
                from: data.from.toLowerCase(),
                to: data.to!.toLowerCase(),
                text: data.data,
                timestamp: data.timestamp!,
                id: data.chainId,
                hash: data.hash
              },
            ])
          : discussions["myself"].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
              hash: data.hash
            });
      }

      // for instances where messages are sent to other addresses.
      if (data.from.toLowerCase() !== userAddress.toLowerCase()) {
        discussions[data.from.toLowerCase()] === undefined
          ? (discussions[data.from.toLowerCase()] = [
              {
                from: data.from.toLowerCase(),
                to: data.to!.toLowerCase(),
                text: data.data,
                timestamp: data.timestamp!,
                id: data.chainId,
                hash: data.hash
              },
            ])
          : discussions[data.from.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
              hash: data.hash
            });
      }

      if (data.to!.toLowerCase() !== userAddress.toLowerCase()) {
        discussions[data.to!.toLowerCase()] === undefined
          ? (discussions[data.to!.toLowerCase()] = [
              {
                from: data.from.toLowerCase(),
                to: data.to!.toLowerCase(),
                text: data.data,
                timestamp: data.timestamp!,
                id: data.chainId,
                hash: data.hash
              },
            ])
          : discussions[data.to!.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
              hash: data.hash
            });
      }
    });

    return discussions;
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
    builder.addCase(fetchDiscussions.fulfilled, (_, action) => action.payload);
  },
});

export const { resetDiscussions } = discussionsSlice.actions;

type selectDiscussions = (state: AppState) => DiscussionsState;

export const selectDiscussions: selectDiscussions = (state: AppState) =>
  state.discussions;

export default discussionsSlice.reducer;
