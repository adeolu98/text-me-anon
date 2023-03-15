
import { formatEther } from 'ethers/lib/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '@/store';
// import contractsData from '@auto-hedge/public/contracts.json';
import { DEFAULT_NETWORK, Network } from '@/lib/network';
import { ethers } from 'ethers';
import { DiscussionsState } from '@/lib/types';


//USE THIS TO FILTER THROUGH ALL TXS TO DIFFERENTIATE WHICH TXS ARE MESSAGE TXS
//THIS IS JUST "OCM:" WHEN HEXED. OCM = ON-CHAIN MESSAGE.
const msgTxIdentifier = "0x4f434d3a"

export const fetchDiscussions = createAsyncThunk(
  'discussions/fetchDiscussions',
  async ({ network, userAddress }: {network: Network, userAddress: string}) => {
    const etherscanProvider = new ethers.providers.EtherscanProvider(
      "matic"
    );
    const history = await etherscanProvider.getHistory(
      userAddress
    );

    const discussions = getInitialState();
   
    const filtered = history.filter((tx) => tx.data.includes(msgTxIdentifier))
    
    filtered.forEach((data) => {
      //for instances where messages are sent to self
      if (data.from.toLowerCase() === data.to!.toLowerCase()){
        discussions["self"] === undefined ? discussions["self"] = [
          {
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
          },
        ] : discussions["self"].push({
          from: data.from.toLowerCase(),
          to: data.to!.toLowerCase(),
          text: data.data,
          timestamp: data.timestamp!,
        })
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
              },
            ])
          : discussions[data.from.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
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
              },
            ])
          : discussions[data.to!.toLowerCase()].push({
              from: data.from.toLowerCase(),
              to: data.to!.toLowerCase(),
              text: data.data,
              timestamp: data.timestamp!,
            });
      }
    });
  
    return discussions
})

function getInitialState() {
  const initialState: DiscussionsState = {};
  return initialState;
}

export const discussionsSlice = createSlice({
  name: 'discussions',
  initialState: getInitialState(),
  reducers: {
    resetDiscussions: () => {},
  },
  extraReducers: builder => {
    builder.addCase(fetchDiscussions.fulfilled, (_, action) => action.payload);
  },
});

export const {
  resetDiscussions,
} = discussionsSlice.actions;

type selectDiscussions = (state: AppState) => DiscussionsState;

export const selectDiscussions: selectDiscussions = (state: AppState) => state.discussions;

export default discussionsSlice.reducer;