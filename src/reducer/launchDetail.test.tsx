import React from "react";
import mockFetch from "cross-fetch";
import reducer, {
	initialState,
	fetchLaunchById,
	getSelectedLaunch,
	getLoadingDetail,
	State,
} from "./launchDetail";
import { initialState as launchesInitialState } from "./launches";
import { LaunchDetail } from "../types";

jest.mock("cross-fetch");

describe("Reducer:launchDetail", () => {
	const mockedFetch = mockFetch as unknown as jest.Mock;

	const launch: LaunchDetail = {
		id: "abc",
		name: "FalconSat",
		date_utc: "2006-03-24T22:30:00.000Z",
		success: false,
		rocket: { name: "Falcon 1", flickr_images: ["img"] },
		flight_number: 1,
		details: "Engine failure at 33 seconds",
	};

	function mockFetchResponse(docs: Array<LaunchDetail>) {
		mockedFetch.mockReturnValueOnce(
			Promise.resolve({
				status: 200,
				json() {
					return Promise.resolve({ docs });
				},
			}),
		);
	}

	it("should set initial state by default", () => {
		const action = { type: "unknown" };

		expect(reducer(undefined, action)).toEqual(initialState);
	});

	it("should handle fetchLaunchById.pending", () => {
		const appState: State = { loading: false, launch: null };

		const action = { type: fetchLaunchById.pending, meta: { arg: "abc" } };

		expect(reducer(appState, action)).toEqual({
			loading: true,
			launch: null,
		});
	});

	it("should clear previous launch on fetchLaunchById.pending", () => {
		const appState: State = { loading: false, launch };

		const action = { type: fetchLaunchById.pending, meta: { arg: "xyz" } };

		expect(reducer(appState, action)).toEqual({
			loading: true,
			launch: null,
		});
	});

	it("should handle fetchLaunchById.fulfilled", () => {
		const appState: State = { loading: true, launch: null };

		const action = {
			type: fetchLaunchById.fulfilled,
			meta: { arg: "abc" },
			payload: launch,
		};

		expect(reducer(appState, action)).toEqual({
			loading: false,
			launch,
		});
	});

	it("should handle fetchLaunchById.rejected", () => {
		const appState: State = { loading: true, launch: null };

		const action = { type: fetchLaunchById.rejected, meta: { arg: "abc" } };

		expect(reducer(appState, action)).toEqual({
			loading: false,
			launch: null,
		});
	});

	describe("Actions::LaunchDetail", () => {
		const dispatch = jest.fn();

		afterEach(() => {
			dispatch.mockClear();
			mockedFetch.mockClear();
		});

		it("should fetch a single launch by id", async () => {
			mockFetchResponse([launch]);

			await fetchLaunchById("abc")(dispatch, () => {}, {});

			expect(dispatch.mock.calls.flat()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: fetchLaunchById.pending.type,
					}),
					expect.objectContaining({
						type: fetchLaunchById.fulfilled.type,
						payload: launch,
					}),
				]),
			);
		});

		it("should return null payload when launch id is not found", async () => {
			mockFetchResponse([]);

			await fetchLaunchById("missing")(dispatch, () => {}, {});

			expect(dispatch.mock.calls.flat()).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						type: fetchLaunchById.fulfilled.type,
						payload: null,
					}),
				]),
			);
		});
	});

	it("test the selectors", () => {
		const launchDetailState: State = { loading: true, launch };

		const rootState = {
			launches: launchesInitialState,
			favorites: [],
			launchDetail: launchDetailState,
		};

		expect(getSelectedLaunch(rootState)).toStrictEqual(launch);
		expect(getLoadingDetail(rootState)).toBe(true);
	});
});
