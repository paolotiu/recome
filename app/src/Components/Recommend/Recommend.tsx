import React, { useEffect, useState } from "react";
import { CenterGrid } from "../index";
import { OptionTile } from "./OptionTile/OptionTile";
import styled from "styled-components";
import { useQueries, useQuery } from "react-query";
import { getTopArtists, getTopTracks } from "../../functions/api";
import { Options, TopResult } from "../../types";

interface Props {
  token: string;
}

const Wrapper = styled(CenterGrid)``;

export const Recommend: React.FC<Props> = ({ token }) => {
  const [options, setOptions] = useState<Options>({
    seed_artists: ["placeholder"],
    seed_genres: ["placeholder"],
    seed_tracks: ["placeholder"],
  });
  const artistsQuery = useQuery("artists", () => getTopArtists(token), {
    // Set top artists after fetching
    onSuccess: (data: TopResult) => {
      setOptions((prev) => {
        return {
          ...prev,
          seed_artists: data.items.map((item) => item.id),
        };
      });
    },
  });

  const tracksQuery = useQuery("artists", () => getTopArtists(token), {
    onSuccess: (data: TopResult) => {
      // Set top tracks and genres after fetching
      setOptions((prev) => {
        return {
          ...prev,
          seed_tracks: data.items.map((item) => item.id),
          seed_genres: data.items.map((item) => item.genres[0]),
        };
      });
    },
  });
  console.log(options);
  if (artistsQuery.isLoading || tracksQuery.isLoading) {
    return <> </>;
  }
  return (
    <Wrapper>
      <div className="option-tiles-container">
        <OptionTile />
      </div>
    </Wrapper>
  );
};
