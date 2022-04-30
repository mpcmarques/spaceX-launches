import React from "react";
import reducer, { initialState, isFavorite, toogleFavorite } from "./favorites";

describe("Reducer:favorites", () => {
  it("should set initial state by default", () => {
    const action = { type: "unknown" };
    const expected = initialState;

    expect(reducer(undefined, action)).toEqual(expected);
  });
});
