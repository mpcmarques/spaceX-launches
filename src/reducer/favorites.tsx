import { Launch as LaunchType } from "../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const initialState: Array<LaunchType> = [];

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toogleFavorite: (state, action: PayloadAction<LaunchType>) => {
      const alreadyExistsIndex = state.findIndex(
        (launch) => launch.id === action.payload.id
      );

      if (alreadyExistsIndex === -1) {
        state.push(action.payload);
      } else {
        state.splice(alreadyExistsIndex);
      }
    },
  },
});

export const isFavorite = (launch: LaunchType) => (state: RootState) =>
  state.favorites.find((launch1) => launch1.id === launch.id);

export const toogleFavorite = favoritesSlice.actions.toogleFavorite;

export default favoritesSlice.reducer;
