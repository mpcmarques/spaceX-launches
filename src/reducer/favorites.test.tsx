import React from "react";
import reducer, { initialState, toogleFavorite } from "./favorites";
import { Launch as LaunchType } from "../types";

describe("Reducer:favorites", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(reducer(undefined, action)).toEqual(expected);
  });

  it("should add a launch to the favorites list", () => {
    const appState: Array<LaunchType> = [];

    const launch = {
      success: false,
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: false,
      id: "5eb87cd9ffd86e000604b32a",
      rocket: {
        name: "Starship",
        flickr_images: ["img"],
      },
    };

    const action = { type: toogleFavorite.type, payload: launch };

    const expected = [launch];

    expect(reducer(appState, action)).toEqual(expected);
  });

  it("should remove a launch from the favorites list", () => {
    const launch = {
      success: false,
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: false,
      id: "5eb87cd9ffd86e000604b32a",
      rocket: {
        name: "Starship",
        flickr_images: ["img"],
      },
    };

    const appState: Array<LaunchType> = [launch];

    const action = { type: toogleFavorite.type, payload: launch };

    const expected: Array<LaunchType> = [];

    expect(reducer(appState, action)).toEqual(expected);
  });
});
