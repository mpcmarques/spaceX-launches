import React from "react";
import Launch from "./Launch";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import { Provider } from "react-redux";
import { Launch as LaunchType } from "../types";
import { toogleFavorite } from "../reducer/favorites";

describe("<Launch />", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  function setup(
    launch: LaunchType,
    favorites: Array<LaunchType> = []
  ): JSX.Element {
    store = configureMockStore()({ favorites: favorites });
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

  describe("expected to match snapshot when favorite is toggled", () => {
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

    it("favorite is clicked", () => {
      const wrapper = mount(setup(launch, [launch]));

      wrapper.find(".favorite-button").simulate("click");

      expect(wrapper.find(".favorite-button").hasClass("favorite")).toEqual(
        true
      );

      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("favorite is clicked again", () => {
      const wrapper = mount(setup(launch));

      wrapper
        .find(".favorite-button")
        .simulate("click", () => store.dispatch(toogleFavorite(launch)));

      expect(wrapper.find(".favorite-button").hasClass("favorite")).toEqual(
        false
      );

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
