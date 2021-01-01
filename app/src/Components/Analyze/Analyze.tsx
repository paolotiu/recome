import React from "react";
import { useQuery } from "react-query";
import { getAllSavedTracks } from "../../functions/api";
import { ScaleLoader } from "react-spinners";
import { CenterGrid } from "../General";
import styled from "styled-components";
import { GenreChart, MoodChart, PopularityHistogram } from "./Charts";
import uniq from "lodash.uniq";
import { transparentize } from "polished";
import {} from "module";
import { AllTracksData } from "../../types";
interface Props {}

const Wrapper = styled(CenterGrid)`
  display: block;
  flex-direction: column;
  align-items: center;
  padding: 0 2em;
  padding-bottom: 100px;
  .spinner-container {
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .css-0 {
      width: fit-content;
      div {
        width: 15px;
        border-radius: 12px;
        height: 100px;
        background-color: ${(props) => props.theme.secondary};
      }
    }
  }

  .content {
    width: 100%;
    display: block;
  }

  div.chart-section {
    background-color: ${transparentize(0.7, "#000")};
    border-radius: 24px;
    max-width: 1000px;
    margin: 50px auto;
    display: grid;
    justify-items: center;
    overflow: hidden;
    grid-template-columns: minmax(0, 1fr);
    padding: 1em;
    gap: 2em;
    :first-child {
      margin-top: 0;
    }
    .chart-text {
      small {
        color: #777;
      }
      h1 {
        font-size: 3em;
        width: fit-content;
        margin: 0 auto;
        @media (max-width: 320px) {
          font-size: 2.5em;
        }
      }
    }
  }
`;
export const Analyze = (props: Props) => {
  const token = localStorage.getItem("token")!;

  const { data: allTracks, isLoading } = useQuery<AllTracksData[]>(
    "allTracks",
    () => getAllSavedTracks(token),
    {
      staleTime: Infinity,
    }
  );

  const artistIDs = uniq(allTracks?.map((x) => x.artistID as string));
  const poplarityNums = allTracks?.map((x) => x.popularity);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="spinner-container">
          <ScaleLoader />
          <p>Fetching data...</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="chart-section">
        <div className="chart-text first">
          <h1>Top Genres</h1>
          <small>* Based on the artists you listen to</small>
        </div>
        <GenreChart
          artistIDs={artistIDs!}
          className="chart-content"
          uid="genreChart"
        />
      </div>
      <div className="chart-section">
        <div className="chart-text first">
          <h1>Popularity</h1>
          <small>* Based on the tracks you saved</small>
        </div>
        <PopularityHistogram popularityNums={poplarityNums!} uid="popchart" />
      </div>
      <div className="chart-section">
        <div className="chart-text first">
          <h1>Mood</h1>
          <small>* Based on the tracks you saved</small>
        </div>
        <MoodChart />
      </div>
    </Wrapper>
  );
};
