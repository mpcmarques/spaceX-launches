import React from "react";
import fetch from "cross-fetch";
import reducer, { initialState, fetchData } from "./launches";
import { Launch as LaunchType } from "../types";

describe("Reducer:launches", () => {
  jest.mock("cross-fetch");

  const mockedFech = fetch as jest.Mocked<typeof fetch>;

  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should handle fetchData.pending", () => {
    const appState = {
      loading: false,
      launches: [],
    };

    const action = { type: fetchData.pending, meta: { arg: {} } };

    const expected = {
      loading: true,
      launches: [],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchData.fullfilled", () => {
    const appState = {
      loading: false,
      launches: [],
    };

    const action = {
      type: fetchData.fulfilled,
      meta: { arg: {} },
      payload: [{ id: "asdf", name: "1", date_utc: "", success: false }],
    };

    const expected = {
      loading: false,
      launches: [{ id: "asdf", name: "1", date_utc: "", success: false }],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should handle fetchData.rejected", () => {
    const appState = {
      loading: false,
      launches: [],
    };

    const action = {
      type: fetchData.rejected,
      meta: { arg: {} },
      payload: [{ id: "asdf", name: "1", date_utc: "", success: false }],
    };

    const expected = {
      loading: false,
      launches: [],
    };

    expect(reducer(appState, action)).toEqual(expected);
  });

  describe("Actions::Launches", () => {
    const dispatch = jest.fn();

    afterAll(() => {
      dispatch.mockClear();
    //   mockedFech.mockClear();
    });

    const launch: LaunchType = {
      id: "asdf",
      name: "1",
      date_utc: "",
      success: false,
      rocket: { name: "name", flickr_images: ["img_url"] },
    };

    it("should fetch the launches", async () => {
    //   mockedFech.mockReturnValueOnce(
    //     Promise.resolve({
    //       status: 200,
    //       json() {
    //         return Promise.resolve([launch]);
    //       },
    //     })
    //   );
    //   await fetchData({})(dispatch, () => {}, {});

    //   const expected = expect.arrayContaining([
    //     expect.objectContaining({
    //       type: fetchData.pending.type,
    //       meta: expect.objectContaining({ arg: {} }),
    //     }),
    //     expect.objectContaining({
    //       type: fetchData.fulfilled.type,
    //       meta: expect.objectContaining({ arg: {} }),
    //       payload: [launch],
    //     }),
    //   ]);
    //   expect(dispatch.mock.calls.flat()).toEqual(expected);
    });
  });
});
