import React from "react";
import styled from "@emotion/styled";
import colors from "../constants/colors";
import { Launch as LaunchType } from "../types";
import { useAppDispatch, useAppSelector } from "../store";
import { isFavorite, toogleFavorite } from "../reducer/favorites";

const LaunchContainer = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 80px;
    object-fit: cover;
    margin-right: 8px;
    border-radius: 10px;
  }
  .content {
    flex-grow: 1;
  }
  .header {
    display: flex;
    justify-content: space-between;
  }

  .favorite-button {
    border-color: ${colors.black};
    cursor: pointer;
    background-color: transparent;
    padding: 8px;
    border-radius: 10px;
    margin-right: 8px;

    &.favorite {
      background-color: ${colors.black};
      color: ${colors.primary};
    }
  }

  margin-bottom: 10px;
  background-color: ${colors.secondaryDark};
  padding: 10px;
  color: ${colors.black};
  border-radius: 10px;
`;

const Launch: React.FC<{ launch: LaunchType }> = ({ launch }) => {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector(isFavorite(launch));

  return (
    <LaunchContainer>
      <button
        name="favorite-button"
        className={`favorite-button ${favorite ? "favorite" : ""}`}
        onClick={() => dispatch(toogleFavorite(launch))}
      >
        Favorite
      </button>
      <img src={launch.rocket.flickr_images[0]} alt="launch-img" />
      <div className="content">
        <div className="header">
          <div>
            <b>Name:</b> {launch.name}
          </div>
          <div>
            <b>Year:</b> {new Date(launch.date_utc).getFullYear()}
          </div>
        </div>
        <div>
          <b>Success:</b>{" "}
          {launch.success == null
            ? "Not launched yet"
            : launch.success
            ? "True"
            : "False"}
        </div>
        <div>
          <b>Rocket name:</b> {launch.rocket.name}
        </div>
      </div>
    </LaunchContainer>
  );
};

export default Launch;
