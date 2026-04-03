import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "@emotion/styled";
import colors from "../constants/colors";
import { useAppDispatch, useAppSelector } from "../store";
import {
	fetchLaunchById,
	getSelectedLaunch,
	getLoadingDetail,
} from "../reducer/launchDetail";
import { isFavorite, toogleFavorite } from "../reducer/favorites";

const LaunchDetailContainer = styled.div`
	background-color: ${colors.bg};
	color: white;
	padding: 12px;
	width: 80%;
	margin-left: 10%;
	min-height: 100vh;

	.back-link {
		color: ${colors.primary};
		text-decoration: none;
		font-weight: bold;
		display: inline-block;
		margin-bottom: 20px;

		&:hover {
			text-decoration: underline;
		}
	}

	header {
		display: flex;
		align-items: center;
		margin-bottom: 20px;

		img {
			height: 120px;
			width: 120px;
			object-fit: contain;
			margin-right: 20px;
			border-radius: 10px;
		}

		h1 {
			margin: 0 0 8px 0;
		}
	}

	.favorite-button {
		border: 2px solid ${colors.primary};
		cursor: pointer;
		background-color: transparent;
		padding: 8px 16px;
		border-radius: 10px;
		color: ${colors.primary};
		font-weight: bold;

		&.favorite {
			background-color: ${colors.primary};
			color: ${colors.bg};
		}
	}

	.detail-section {
		background-color: ${colors.secondaryDark};
		color: ${colors.black};
		padding: 16px;
		border-radius: 10px;
		margin-bottom: 16px;

		h2 {
			margin-top: 0;
		}

		.field {
			margin-bottom: 8px;
		}

		a {
			color: ${colors.bg};
			font-weight: bold;
		}

		ul {
			padding-left: 20px;
		}
	}

	.rocket-images {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		img {
			height: 150px;
			object-fit: cover;
			border-radius: 10px;
		}
	}
`;

const LaunchDetail: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch = useAppDispatch();
	const launch = useAppSelector(getSelectedLaunch);
	const loading = useAppSelector(getLoadingDetail);
	const favorite = useAppSelector((state) =>
		launch ? isFavorite(launch)(state) : undefined,
	);

	useEffect(() => {
		if (id) {
			dispatch(fetchLaunchById(id));
		}
	}, [id, dispatch]);

	if (loading) {
		return (
			<LaunchDetailContainer>
				<Link className="back-link" to="/">
					&larr; Back to launches
				</Link>
				<h2>Loading...</h2>
			</LaunchDetailContainer>
		);
	}

	if (!launch) {
		return (
			<LaunchDetailContainer>
				<Link className="back-link" to="/">
					&larr; Back to launches
				</Link>
				<h2>Launch not found</h2>
			</LaunchDetailContainer>
		);
	}

	const patchImage = launch.links?.patch?.large || launch.links?.patch?.small;

	return (
		<LaunchDetailContainer>
			<Link className="back-link" to="/">
				&larr; Back to launches
			</Link>

			<header>
				{patchImage ? (
					<img src={patchImage} alt="mission-patch" />
				) : null}
				<div>
					<h1>{launch.name}</h1>
					<button
						name="favorite-button"
						className={`favorite-button ${favorite ? "favorite" : ""}`}
						onClick={() => dispatch(toogleFavorite(launch))}
					>
						{favorite ? "Favorited" : "Favorite"}
					</button>
				</div>
			</header>

			<section className="detail-section">
				<h2>Mission</h2>
				{launch.flight_number != null ? (
					<div className="field">
						<b>Flight number:</b> {launch.flight_number}
					</div>
				) : null}
				<div className="field">
					<b>Date (UTC):</b> {new Date(launch.date_utc).toUTCString()}
				</div>
				<div className="field">
					<b>Success:</b>{" "}
					{launch.success == null
						? "Not launched yet"
						: launch.success
							? "True"
							: "False"}
				</div>
				<div className="field">
					<b>Upcoming:</b> {launch.upcoming ? "True" : "False"}
				</div>
				{launch.crew && launch.crew.length > 0 ? (
					<div className="field">
						<b>Crew count:</b> {launch.crew.length}
					</div>
				) : null}
				{launch.details ? (
					<div className="field">
						<b>Details:</b> {launch.details}
					</div>
				) : null}
			</section>

			{launch.failures && launch.failures.length > 0 ? (
				<section className="detail-section">
					<h2>Failures</h2>
					<ul>
						{launch.failures.map((failure, index) => (
							<li key={index}>
								<b>Reason:</b> {failure.reason}
								{failure.time != null
									? ` (at T+${failure.time}s)`
									: ""}
								{failure.altitude != null
									? ` (altitude ${failure.altitude}km)`
									: ""}
							</li>
						))}
					</ul>
				</section>
			) : null}

			<section className="detail-section">
				<h2>Rocket</h2>
				<div className="field">
					<b>Name:</b> {launch.rocket.name}
				</div>
				{launch.rocket.flickr_images.length > 0 ? (
					<div className="rocket-images">
						{launch.rocket.flickr_images.map((img, index) => (
							<img
								key={index}
								src={img}
								alt={`rocket-${index}`}
							/>
						))}
					</div>
				) : null}
			</section>

			{launch.launchpad ? (
				<section className="detail-section">
					<h2>Launchpad</h2>
					<div className="field">
						<b>Name:</b> {launch.launchpad.full_name}
					</div>
					<div className="field">
						<b>Location:</b> {launch.launchpad.locality},{" "}
						{launch.launchpad.region}
					</div>
				</section>
			) : null}

			{launch.payloads && launch.payloads.length > 0 ? (
				<section className="detail-section">
					<h2>Payloads</h2>
					<ul>
						{launch.payloads.map((payload) => (
							<li key={payload.id}>
								<b>{payload.name}</b> ({payload.type})
								{payload.mass_kg != null
									? ` — ${payload.mass_kg}kg`
									: ""}
								{payload.orbit
									? ` — orbit: ${payload.orbit}`
									: ""}
							</li>
						))}
					</ul>
				</section>
			) : null}

			{launch.links &&
			(launch.links.webcast ||
				launch.links.article ||
				launch.links.wikipedia) ? (
				<section className="detail-section">
					<h2>Links</h2>
					{launch.links.webcast ? (
						<div className="field">
							<a
								href={launch.links.webcast}
								target="_blank"
								rel="noopener noreferrer"
							>
								Webcast
							</a>
						</div>
					) : null}
					{launch.links.article ? (
						<div className="field">
							<a
								href={launch.links.article}
								target="_blank"
								rel="noopener noreferrer"
							>
								Article
							</a>
						</div>
					) : null}
					{launch.links.wikipedia ? (
						<div className="field">
							<a
								href={launch.links.wikipedia}
								target="_blank"
								rel="noopener noreferrer"
							>
								Wikipedia
							</a>
						</div>
					) : null}
				</section>
			) : null}
		</LaunchDetailContainer>
	);
};

export default LaunchDetail;
