import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getAllSavedTracks, getGenresofArtists } from "../../functions/api";
import { ScaleLoader } from "react-spinners";
import { CenterGrid } from "../General";
import uniq from "lodash.uniq";
import styled from "styled-components";
import { GenreChart } from "./Charts/GenreChart";
interface Props {}

const Wrapper = styled(CenterGrid)`
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

  const artistIDs = allTracks?.map((x) => x.artistID as string);

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
    <div>
      <GenreChart artistIDs={artistIDs!} />
    </div>
  );
};
