import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";
import { ethers } from "ethers";
import { DiscussionsState } from "@/lib/types";
import { Chain } from "wagmi";
import { Network, networks } from "@/lib/network";

//USE THIS TO FILTER THROUGH ALL TXS TO DIFFERENTIATE WHICH TXS ARE MESSAGE TXS
//THIS IS JUST "OCM:" WHEN HEXED. OCM = ON-CHAIN MESSAGE.
const msgTxIdentifier = "0x4f434d3a";

const fetchAllHistory = async (address: string): Promise<any[]> => {
  const getEtherscanProvider = (network: number) => new ethers.providers.EtherscanProvider(
    network
  );
  const etherScanProviders = networks
    .map(getEtherscanProvider)
  const settledNetworks: Network[] = []
  const allHistory = (await Promise.allSettled(etherScanProviders.map(provider => provider.getHistory(address))))
    .filter((result, index) => {
      if(result.status === "rejected"){
        console.error(result.reason)
        return false
      }
      settledNetworks.push(networks[index])
      return true;
    })
    .map((result, index) => {
        const txs = (result as PromiseFulfilledResult<any>).value;
        return txs.map((tx: any) => ({...tx, chainId: settledNetworks[index]}))
      }
    )

  return [].concat(...allHistory)
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
              },
            ])
          : discussions["myself"].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
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
              },
            ])
          : discussions[data.from.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
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
              },
            ])
          : discussions[data.to!.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: data.chainId,
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
