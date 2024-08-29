import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type T = {
  lat: number;
  lng: number;
} | null;

const user_location = createSlice({
  name: "user_location",
  initialState: null as T,
  reducers: {
    setUserLocation: (_, action: PayloadAction<T>) => {
      return action.payload;
    },
  },
});

export const { setUserLocation } = user_location.actions;
export default user_location.reducer;
