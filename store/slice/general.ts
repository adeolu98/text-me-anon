import { ChatMode } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/store";

interface GeneralState {
  mode: ChatMode | undefined
}

export const generalSlice = createSlice<
  GeneralState,
  {setMode: (state: GeneralState, action: PayloadAction<ChatMode>) => void}
>({
  name: "general",
  initialState: {
    mode: undefined
  },
  reducers: {
    setMode: (state, action: PayloadAction<ChatMode>) => {
      state.mode = action.payload;
    }
  }
})

export const selectMode = (state: AppState) => state.general.mode

export const {setMode} = generalSlice.actions

export default generalSlice.reducer;