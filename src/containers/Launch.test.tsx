import React from "react";
import Launch from "./Launch";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Launch as LaunchType } from "../types";
import { toogleFavorite } from "../reducer/favorites";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

describe("<Launch />", () => {
	let store: MockStoreEnhanced<unknown, {}>;

	function buildLaunch(overrides: Partial<LaunchType> = {}): LaunchType {
		return {
			success: false,
			name: "FalconSat",
			date_utc: "2006-03-24T22:30:00.000Z",
			upcoming: false,
			id: "5eb87cd9ffd86e000604b32a",
			rocket: {
				name: "Starship",
				flickr_images: ["img"],
			},
			...overrides,
		};
	}

	function setup(
		launch: LaunchType,
		favorites: Array<LaunchType> = [],
	): JSX.Element {
		store = configureMockStore()({ favorites: favorites });
		return (
			<Provider store={store}>
				<MemoryRouter>
					<Launch launch={launch} />
				</MemoryRouter>
			</Provider>
		);
	}

	afterEach(() => {
		store.clearActions();
		mockNavigate.mockClear();
	});

	it("expected to match snapshot when launch failed", () => {
		const wrapper = mount(setup(buildLaunch({ success: false })));

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("expected to match snapshot when launch succeeded", () => {
		const wrapper = mount(setup(buildLaunch({ success: true })));

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("expected to match snapshot when launch success is null", () => {
		const wrapper = mount(setup(buildLaunch({ success: undefined })));

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	describe("expected to match snapshot when favorite is toggled", () => {
		const launch = buildLaunch({ success: undefined });

		it("favorite is clicked", () => {
			const wrapper = mount(setup(launch, [launch]));

			wrapper.find(".favorite-button").simulate("click");

			expect(
				wrapper.find(".favorite-button").hasClass("favorite"),
			).toEqual(true);

			expect(toJson(wrapper)).toMatchSnapshot();
		});

		it("favorite is clicked again", () => {
			const wrapper = mount(setup(launch));

			wrapper
				.find(".favorite-button")
				.simulate("click", () =>
					store.dispatch(toogleFavorite(launch)),
				);

			expect(
				wrapper.find(".favorite-button").hasClass("favorite"),
			).toEqual(false);

			expect(toJson(wrapper)).toMatchSnapshot();
		});
	});

	it("navigates to detail page when the card is clicked", () => {
		const wrapper = mount(setup(buildLaunch()));

		wrapper.find("div").first().simulate("click");

		expect(mockNavigate).toHaveBeenCalledWith(
			"/launch/5eb87cd9ffd86e000604b32a",
		);
	});

	it("does not navigate when favorite button is clicked", () => {
		const wrapper = mount(setup(buildLaunch()));

		wrapper.find(".favorite-button").simulate("click");

		expect(mockNavigate).not.toHaveBeenCalled();
	});
});
