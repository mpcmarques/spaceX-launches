import React from "react";
import Launches from "./Launches";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

describe("<Launches />", () => {
  it("renders without crashing given the required props", () => {
    const props = {
      title: "Upcoming",
      launches: [
        {
          success: false,
          name: "FalconSat",
          date_utc: "2006-03-24T22:30:00.000Z",
          upcoming: false,
          id: "5eb87cd9ffd86e000604b32a",
          rocket: {
            name: "Starship",
            flickr_images: ["img"],
          },
        },
      ],
      loading: false,
    };
    const wrapper = shallow(<Launches {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("shows no launches when it is loading", () => {
    const props = {
      title: "Upcoming",
      launches: [],
      loading: true,
    };
    const wrapper = shallow(<Launches {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("shows no launches when it doesnt fetch launches", () => {
    const props = {
      title: "Upcoming",
      launches: [],
      loading: false,
    };
    const wrapper = shallow(<Launches {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
