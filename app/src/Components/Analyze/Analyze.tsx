import React from "react";
import { useQuery } from "react-query";
import { getAllSavedTracks } from "../../functions/api";
import { ScaleLoader } from "react-spinners";
import { CenterGrid } from "../General";
import styled from "styled-components";
import { GenreChart } from "./Charts/GenreChart";
import uniq from "lodash.uniq";
import { transparentize } from "polished";
import {} from "module";
interface Props {}

const Wrapper = styled(CenterGrid)`
  display: block;
  flex-direction: column;
  align-items: center;
  padding: 0 1em;
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
    margin: 0 auto;
    display: grid;
    justify-items: center;
    overflow: hidden;
    grid-template-columns: minmax(0, 1fr);
    padding: 1em;
    gap: 2em;
    .chart-text {
      small {
        color: #777;
      }
      h1 {
        font-size: 3em;

        @media (max-width: 320px) {
          font-size: 2.5em;
        }
      }
    }
  }
`;
export const Analyze = (props: Props) => {
  const token = localStorage.getItem("token")!;

  const { data: allTracks, isLoading } = useQuery(
    "allTracks",
    () => getAllSavedTracks(token),
    {
      staleTime: Infinity,
    }
  );

  const artistIDs = uniq(allTracks?.map((x) => x.artistID as string));

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
        <GenreChart artistIDs={artistIDs!} className="chart-content" />
      </div>
    </Wrapper>
  );
};
