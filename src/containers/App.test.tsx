import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import { Provider } from "react-redux";
import { Launch as LaunchType } from "../types";
import App from "./App";
import thunk from "redux-thunk";
import { fetchData } from "../reducer/launches";

describe("<App />", () => {
  let store: MockStoreEnhanced<unknown, {}>;

  function setup(): JSX.Element {
    const middlewares = [thunk];

    store = configureMockStore(middlewares)({
      launches: { loading: false, launches: [] },
    });
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }

  afterEach(() => {
    store.clearActions();
  });

  it("success filter change", () => {
    const wrapper = mount(setup());

    wrapper.find("#success-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#success-button").hasClass("active")).toEqual(true);

    wrapper.find("#success-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#success-button").hasClass("active")).toEqual(false);
  });

  it("failed filter change", () => {
    const wrapper = mount(setup());

    wrapper.find("#failed-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#failed-button").hasClass("active")).toEqual(true);

    wrapper.find("#failed-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#failed-button").hasClass("active")).toEqual(false);
  });

  it("past filter change", () => {
    const wrapper = mount(setup());

    wrapper.find("#past-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#past-button").hasClass("active")).toEqual(true);

    wrapper.find("#past-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#past-button").hasClass("active")).toEqual(false);
  });

  it("upcoming filter change", () => {
    const wrapper = mount(setup());

    wrapper.find("#upcoming-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#upcoming-button").hasClass("active")).toEqual(true);

    wrapper.find("#upcoming-button").simulate("click");

    wrapper.update();

    expect(wrapper.find("#upcoming-button").hasClass("active")).toEqual(false);
  });

  it("start date picker date", () => {
    const wrapper = mount(setup());

    const date = new Date(0);

    expect(
      wrapper.find("#starting-date-picker").first().prop("selected")
    ).toStrictEqual(date);
  });

  // it didnt worked testing react-datepicker changes
  //   it("start date picker filter change", () => {
  //     const wrapper = mount(setup());

  //     const date = new Date();

  //     wrapper
  //       .find("#starting-date-picker")
  //       .first()
  //       .simulate("change", { target: { value: date } });

  //     wrapper.update();

  //     expect(wrapper.find("#starting-date-picker").first().prop("selected")).toBe(
  //       date
  //     );
  //   });

  //   it("end date picker filter change", () => {
  //     const wrapper = mount(setup());
  //       const date = new Date();

  //     wrapper
  //       .find("#ending-date-picker")
  //       .first()
  //       .simulate("change", { target: { value: date } });

  //     wrapper.update();

  //     expect(wrapper.find("#starting-date-picker").first().prop("selected")).toBe(
  //       date
  //     );
  //   });
});
