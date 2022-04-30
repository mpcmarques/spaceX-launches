import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Filter, Launch } from "../types";

export interface State {
  loading: boolean;
  launches: Array<Launch>;
}

export const initialState: State = {
  loading: false,
  launches: [],
};

export const fetchData = createAsyncThunk(
  "spaceXlaunches",
  async (query: Filter) => {
    // @ts-ignore
    const request = await fetch(
      "https://api.spacexdata.com/v4/launches/query",
      {
        method: "POST",
        mode: "cors",
        // @ts-ignore
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: { ...query },
          options: { populate: ["rocket"], pagination: false },
        }),
        // @ts-ignore
      }
    );

    // @ts-ignore
    const { docs }: { docs: Array<Launch> } = await request.json();

    return docs;
  }
);

const spaceXlaunchesSlice = createSlice({
  name: "spaceX",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.launches = action.payload;
    });
    builder.addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.launches = [];
    });
  },
});

export const getLaunches = (state: RootState) => state.launches;

export const getUpcomingLanches = (state: RootState) =>
  state.launches.launches.filter((launch) => launch.upcoming === true);

export const getPastLaunches = (state: RootState) =>
  state.launches.launches.filter((launch) => launch.upcoming === false);

export default spaceXlaunchesSlice.reducer;
