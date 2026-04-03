import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./containers/App";
import LaunchDetail from "./containers/LaunchDetail";
import reportWebVitals from "./reportWebVitals";
import store from "./store";
import { Provider } from "react-redux";
import { HashRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<HashRouter>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/launch/:id" element={<LaunchDetail />} />
				</Routes>
			</HashRouter>
		</Provider>
	</React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
