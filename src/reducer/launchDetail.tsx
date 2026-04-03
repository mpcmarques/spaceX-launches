import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { LaunchDetail } from "../types";
import fetch from "cross-fetch";

export interface State {
	loading: boolean;
	launch: LaunchDetail | null;
}

export const initialState: State = {
	loading: false,
	launch: null,
};

export const fetchLaunchById = createAsyncThunk(
	"spaceXlaunchById",
	async (id: string) => {
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
					query: { _id: id },
					options: {
						populate: [
							{
								path: "rocket",
							},
							{
								path: "launchpad",
							},
							{
								path: "payloads",
							},
						],
						pagination: false,
					},
				}),
				// @ts-ignore
			},
		);

		const { docs }: { docs: Array<LaunchDetail> } = await request.json();

		return docs.length > 0 ? docs[0] : null;
	},
);

const launchDetailSlice = createSlice({
	name: "launchDetail",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchLaunchById.pending, (state, action) => {
			state.loading = true;
			state.launch = null;
		});
		builder.addCase(fetchLaunchById.fulfilled, (state, action) => {
			state.loading = false;
			state.launch = action.payload;
		});
		builder.addCase(fetchLaunchById.rejected, (state, action) => {
			state.loading = false;
			state.launch = null;
		});
	},
});

export const getSelectedLaunch = (state: RootState) =>
	state.launchDetail.launch;

export const getLoadingDetail = (state: RootState) =>
	state.launchDetail.loading;

export default launchDetailSlice.reducer;
