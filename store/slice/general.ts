import { ChatMode } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";

interface GeneralState {
  mode: ChatMode | undefined;
  chatOpened: string | undefined;
}

export const generalSlice = createSlice<
  GeneralState,
  {
    setMode: (state: GeneralState, action: PayloadAction<ChatMode>) => void;
    setChatOpened: (state: GeneralState, action: PayloadAction<string>) => void;
  }
>({
  name: "general",
  initialState: {
    mode: undefined,
    chatOpened:undefined
  },
  reducers: {
    setMode: (state, action: PayloadAction<ChatMode>) => {
      state.mode = action.payload;
    },
    setChatOpened:  (state, action: PayloadAction<string>) => {
      state.chatOpened = action.payload;
    }
  },
});

export const selectMode = (state: AppState) => state.general.mode;
export const selectChatOpened = (state: AppState) => state.general.chatOpened

export const { setMode, setChatOpened } = generalSlice.actions;

export default generalSlice.reducer;
