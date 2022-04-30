import React, { useEffect, useState } from "react";
import {
  fetchData,
  getPastLaunches,
  getLaunches,
  getUpcomingLanches,
} from "../reducer/launches";
import { useAppDispatch, useAppSelector } from "../store";
import styled from "@emotion/styled";
import colors from "../constants/colors";
import Launches from "../components/Launches";
import { Filter } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AppContainer = styled.div`
  background-color: ${colors.bg};
  color: white;
  padding-left: 12px;
  padding-right: 12px;

  width: 80%;
  margin-left: 10%;

  header {
    text-align: center;
    h1 {
      margin-top: 12px;
    }
  }

  .filters {
    margin-bottom: 20px;
    button {
      padding: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-right: 12px;
      background-color: transparent;
      border-color: ${colors.primary};
      border-radius: 12px;
      color: ${colors.primary};
      cursor: pointer;

      &.active {
        background-color: ${colors.primary};
        color: ${colors.bg};
      }
    }

    .filters-content {
      display: flex;

      @media screen and (max-width: 992px) {
        overflow-x: auto;
      }
    }

    .react-datepicker-wrapper {
      width: auto;
    }

    .react-datepicker__input-container {
      width: auto;
    }
  }

  .lists {
    display: flex;

    section {
      width: 50%;
    }

    section:first-of-type {
      margin-right: 20px;
    }

    @media screen and (max-width: 992px) {
      display: block;
      section {
        width: 100%;
        margin-right: 0;
      }
    }
  }
`;

function App() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(getLaunches);
  const upcomingLaunches = useAppSelector(getUpcomingLanches);
  const pastLaunches = useAppSelector(getPastLaunches);
  const [filter, setFilter] = useState<Filter>({});
  const [selectedStartingDate, setSelectedStartingDate] = useState<Date | null>(
    new Date(0)
  );
  const [selectedEndingDate, setSelectedEndingDate] = useState<Date | null>(
    new Date(Date.now())
  );

  useEffect(() => {
    dispatch(fetchData(filter));
  }, [filter, dispatch]);

  return (
    <AppContainer>
      <header>
        <h1>SpaceX Launches</h1>
      </header>
      <div className="filters">
        <h2>Filters</h2>
        <div className="filters-content">
          <DatePicker
            selected={selectedStartingDate}
            onChange={(date) => {
              setSelectedStartingDate(date);
              setFilter({ ...filter, date_utc: { $gte: date?.toUTCString() } });
            }}
            customInput={
              <button>{`Start date: ${selectedStartingDate?.toLocaleDateString()}`}</button>
            }
          />

          <DatePicker
            selected={selectedEndingDate}
            onChange={(date) => {
              setSelectedEndingDate(date);
              setFilter({ ...filter, date_utc: { $lte: date?.toUTCString() } });
            }}
            customInput={
              <button>{`Ending date: ${selectedStartingDate?.toLocaleDateString()}`}</button>
            }
          />

          <button
            className={filter.success ? "active" : ""}
            onClick={() => {
              if (filter.success == null || filter.success === false) {
                setFilter({ ...filter, success: true });
              } else {
                setFilter({ ...filter, success: undefined });
              }
            }}
          >
            Succeded
          </button>
          <button
            className={filter.success === false ? "active" : ""}
            onClick={() => {
              if (filter.success == null || filter.success === true) {
                setFilter({ ...filter, success: false });
              } else {
                setFilter({ ...filter, success: undefined });
              }
            }}
          >
            Unsucceded
          </button>
          <button
            className={filter.upcoming === false ? "active" : ""}
            onClick={() => {
              if (filter.upcoming == null || filter.upcoming === true) {
                setFilter({ ...filter, upcoming: false });
              } else {
                setFilter({ ...filter, upcoming: undefined });
              }
            }}
          >
            Past
          </button>
          <button
            className={filter.upcoming ? "active" : ""}
            onClick={() => {
              if (filter.upcoming == null || filter.upcoming === false) {
                setFilter({ ...filter, upcoming: true });
              } else {
                setFilter({ ...filter, upcoming: undefined });
              }
            }}
          >
            Upcoming
          </button>
        </div>
      </div>
      <div className="lists">
        <Launches
          title="Upcoming launches"
          launches={upcomingLaunches}
          loading={state.loading}
        />
        <Launches
          title="Past launches"
          launches={pastLaunches}
          loading={state.loading}
        />
      </div>
    </AppContainer>
  );
}

export default App;
