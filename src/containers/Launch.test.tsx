import React from "react";
import Launch from "./Launch";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import { Provider } from "react-redux";
import { Launch as LaunchType } from "../types";
import { isFavorite, toogleFavorite } from "../reducer/favorites";

describe("<Launch />", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  function setup(launch: LaunchType): JSX.Element {
    store = configureMockStore()({ favorites: [launch] });
    return (
      <Provider store={store}>
        <Launch launch={launch} />
      </Provider>
    );
  }

  afterEach(() => {
    store.clearActions();
  });

  it("expected to match snapshot when launch failed", () => {
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

    const wrapper = mount(setup(launch));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("expected to match snapshot when launch succeeded", () => {
    const launch = {
      success: true,
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: false,
      id: "5eb87cd9ffd86e000604b32a",
      rocket: {
        name: "Starship",
        flickr_images: ["img"],
      },
    };
    const wrapper = mount(setup(launch));

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("expected to match snapshot when launch success is null", () => {
    const launch = {
      success: undefined,
      name: "FalconSat",
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: false,
      id: "5eb87cd9ffd86e000604b32a",
      rocket: {
        name: "Starship",
        flickr_images: ["img"],
      },
    };
    const wrapper = mount(setup(launch));

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
