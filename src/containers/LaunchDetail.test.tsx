import React from "react";
import LaunchDetail from "./LaunchDetail";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureMockStore, { MockStoreEnhanced } from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { LaunchDetail as LaunchDetailType } from "../types";
import thunk from "redux-thunk";
import { toogleFavorite } from "../reducer/favorites";

describe("<LaunchDetail />", () => {
	let store: MockStoreEnhanced<unknown, {}>;

	const fullLaunch: LaunchDetailType = {
		id: "abc",
		name: "FalconSat",
		date_utc: "2006-03-24T22:30:00.000Z",
		success: false,
		upcoming: false,
		rocket: { name: "Falcon 1", flickr_images: ["img1", "img2"] },
		flight_number: 1,
		details: "Engine failure at 33 seconds and loss of vehicle",
		launchpad: {
			name: "Kwajalein Atoll",
			full_name: "Kwajalein Atoll Omelek Island",
			locality: "Omelek Island",
			region: "Marshall Islands",
		},
		payloads: [
			{
				id: "p1",
				name: "FalconSAT-2",
				type: "Satellite",
				mass_kg: 20,
				orbit: "LEO",
			},
		],
		links: {
			patch: { small: "patch_small", large: "patch_large" },
			webcast: "https://youtube.com/watch",
			article: "https://article.com",
			wikipedia: "https://wikipedia.org",
		},
		failures: [
			{ time: 33, altitude: null, reason: "merlin engine failure" },
		],
		crew: [],
	};

	function buildLaunch(
		overrides: Partial<LaunchDetailType> = {},
	): LaunchDetailType {
		return {
			id: "abc",
			name: "Starlink",
			date_utc: "2020-01-01T00:00:00.000Z",
			success: true,
			upcoming: false,
			rocket: { name: "Falcon 9", flickr_images: [] },
			...overrides,
		};
	}

	function setup(
		launch: LaunchDetailType | null,
		loading: boolean = false,
		favorites: Array<LaunchDetailType> = [],
	): JSX.Element {
		store = configureMockStore([thunk])({
			launchDetail: { loading, launch },
			favorites,
		});

		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={["/launch/abc"]}>
					<Routes>
						<Route path="/launch/:id" element={<LaunchDetail />} />
					</Routes>
				</MemoryRouter>
			</Provider>
		);
	}

	afterEach(() => {
		store.clearActions();
	});

	it("shows loading state", () => {
		const wrapper = mount(setup(null, true));

		expect(wrapper.text()).toContain("Loading...");
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("shows not found state when launch is null", () => {
		const wrapper = mount(setup(null, false));

		expect(wrapper.text()).toContain("Launch not found");
		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("renders full launch details", () => {
		const wrapper = mount(setup(fullLaunch));

		expect(wrapper.find("h1").text()).toBe("FalconSat");
		expect(wrapper.text()).toContain("Flight number: 1");
		expect(wrapper.text()).toContain(
			"Engine failure at 33 seconds and loss of vehicle",
		);
		expect(wrapper.text()).toContain("Falcon 1");
		expect(wrapper.text()).toContain("Kwajalein Atoll Omelek Island");
		expect(wrapper.text()).toContain("Omelek Island, Marshall Islands");
		expect(wrapper.text()).toContain("FalconSAT-2");
		expect(wrapper.text()).toContain("merlin engine failure");

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("renders minimal launch without optional sections", () => {
		const wrapper = mount(setup(buildLaunch()));

		expect(wrapper.find("h1").text()).toBe("Starlink");
		expect(wrapper.text()).toContain("Success: True");
		expect(wrapper.text()).not.toContain("Failures");
		expect(wrapper.text()).not.toContain("Launchpad");
		expect(wrapper.text()).not.toContain("Payloads");
		expect(wrapper.text()).not.toContain("Links");

		expect(toJson(wrapper)).toMatchSnapshot();
	});

	it("renders upcoming launch with success null", () => {
		const wrapper = mount(
			setup(buildLaunch({ success: undefined, upcoming: true })),
		);

		expect(wrapper.text()).toContain("Success: Not launched yet");
		expect(wrapper.text()).toContain("Upcoming: True");
	});

	it("dispatches fetchLaunchById on mount with route param", () => {
		mount(setup(null, true));

		expect(store.getActions()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					type: "spaceXlaunchById/pending",
					meta: expect.objectContaining({ arg: "abc" }),
				}),
			]),
		);
	});

	it("dispatches toogleFavorite when favorite button is clicked", () => {
		const wrapper = mount(setup(fullLaunch));

		store.clearActions();

		wrapper.find(".favorite-button").simulate("click");

		expect(store.getActions()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ type: toogleFavorite.type }),
			]),
		);
	});

	it("shows favorite state when launch is favorited", () => {
		const wrapper = mount(setup(fullLaunch, false, [fullLaunch]));

		expect(wrapper.find(".favorite-button").hasClass("favorite")).toBe(
			true,
		);
		expect(wrapper.find(".favorite-button").text()).toBe("Favorited");
	});

	it("renders external links with correct hrefs", () => {
		const wrapper = mount(setup(fullLaunch));

		const webcastLink = wrapper.find('a[href="https://youtube.com/watch"]');
		expect(webcastLink.exists()).toBe(true);
		expect(webcastLink.prop("target")).toBe("_blank");

		expect(wrapper.find('a[href="https://article.com"]').exists()).toBe(
			true,
		);
		expect(wrapper.find('a[href="https://wikipedia.org"]').exists()).toBe(
			true,
		);
	});

	it("renders back link to home", () => {
		const wrapper = mount(setup(fullLaunch));

		const backLink = wrapper.find("a.back-link");
		expect(backLink.exists()).toBe(true);
		expect(backLink.prop("href")).toBe("/");
	});
});
