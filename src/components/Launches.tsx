import styled from "@emotion/styled";
import React from "react";
import Launch from "../containers/Launch";
import { Launch as LaunchType } from "../types";

const LaunchesContainer = styled.section`
  .launches {
    height: 430px;
    overflow-y: scroll;

    div:last-of-type {
      margin-bottom: 0;
    }
  }
`;

const Launches: React.FC<{
  title: string;
  launches: Array<LaunchType>;
  loading: boolean;
}> = ({ launches, title, loading }) => {
  return (
    <LaunchesContainer>
      <h3>{title}</h3>
      {loading ? (
        <h4>Loading...</h4>
      ) : (
        <div className={"launches"}>
          {launches.length > 0
            ? launches.map((launch, index) => (
                <Launch key={index} launch={launch} />
              ))
            : "No launches"}
        </div>
      )}
    </LaunchesContainer>
  );
};

export default Launches;
