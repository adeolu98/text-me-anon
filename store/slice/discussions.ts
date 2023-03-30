import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";
import { ethers } from "ethers";
import { DiscussionsState } from "@/lib/types";
import { Chain } from "wagmi";

//USE THIS TO FILTER THROUGH ALL TXS TO DIFFERENTIATE WHICH TXS ARE MESSAGE TXS
//THIS IS JUST "OCM:" WHEN HEXED. OCM = ON-CHAIN MESSAGE.
const msgTxIdentifier = "0x4f434d3a";

export const fetchDiscussions = createAsyncThunk(
  "discussions/fetchDiscussions",
  async ({
    network,
    userAddress,
  }: {
    network: (Chain & { unsupported?: boolean | undefined }) | undefined;
    userAddress: string;
  }) => {
    const etherscanProvider = new ethers.providers.EtherscanProvider(
      network?.network
    );
    const history = await etherscanProvider.getHistory(userAddress);
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
                id: network?.id,
              },
            ])
          : discussions["myself"].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: network?.id,
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
                id: network?.id,
              },
            ])
          : discussions[data.from.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: network?.id,
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
                id: network?.id,
              },
            ])
          : discussions[data.to!.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
              id: network?.id,
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
