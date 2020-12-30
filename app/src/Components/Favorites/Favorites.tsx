import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTopArtists, getTopTracks } from "../../functions/api";
import { ResultArtist, ResultTrack } from "../../types";
import { Button, CenterGrid } from "../General";
import { v4 as uuid } from "uuid";
import { TrackTile } from "./Tiles/TrackTile";
import { ArtistTile } from "./Tiles/ArtistTile";
import ReactGA from "react-ga";
const SwitchBtn = styled.button<{ isActive: boolean }>`
  border: none;
  font-size: 1.6em;
  font-weight: 700;
  color: ${(props) =>
    props.isActive ? props.theme.secondary : props.theme.darkBg};

  background-color: transparent;
`;

const CreateButton = styled(Button)`
  position: fixed;
  width: clamp(100px, 40vw, 400px);
  font-size: 1em;
  bottom: 20px;
  right: 20px;
`;
const Wrapper = styled(CenterGrid)`
  padding: 1em;
  width: 100%;
  justify-content: center;
  justify-items: center;
  align-items: center;
  gap: 2em;
  select {
    padding: 0;
    height: fit-content;
    background-color: transparent;
    border: none;
    color: ${(props) => props.theme.darkBg};
    font-weight: bold;
    font-size: 1.2em;
  }
  .fave-switch-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    width: 80vw;
    gap: 1em;
  }
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    h1 {
      max-width: 700px;
    }
  }

  .top-tracks-container {
    display: grid;
    gap: 0.8em;
    padding: 0 1em;
    max-width: 700px;
  }

  .top-artists-container {
    display: grid;

    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    gap: 1em;
    max-width: 800px;
    .popularity {
      grid-column: 1/-1;
      max-width: 100%;
    }
    @media (max-width: 565px) {
      grid-template-columns: 1fr 1fr;
    }
  }
`;
interface Props {}

export const Favorites = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const [isTracks, setIsTracks] = useState(true);
  useEffect(() => {
    ReactGA.pageview("/favorites");
  }, []);
  const [timeRange, setTimeRange] = useState<
    "medium_term" | "short_term" | "long_term"
  >("medium_term");
  const tracksQueryFirst = useQuery<{ items: ResultTrack[] }>(
    ["tracks", timeRange],
    () => getTopTracks(token, 50, 0, timeRange),
    {
      staleTime: Infinity,
    }
  );
  const tracksQuerySecond = useQuery<{ items: ResultTrack[] }>(
    ["tracks", 49, timeRange],
    () => getTopTracks(token, 50, 49, timeRange),
    {
      staleTime: Infinity,
    }
  );
  const artistsQueryFirst = useQuery<{ items: ResultArtist[] }>(
    ["artists", timeRange],
    () => getTopArtists(token, 50, 0, timeRange),
    {
      staleTime: Infinity,
    }
  );
  const artistsQuerySecond = useQuery<{ items: ResultArtist[] }>(
    ["artists", 49, timeRange],
    () => getTopArtists(token, 50, 49, timeRange),
    {
      staleTime: Infinity,
    }
  );

  const tracksPopularity = useMemo(() => {
    if (tracksQueryFirst.data && tracksQuerySecond.data) {
      return getAveragePopularity([
        ...tracksQueryFirst.data?.items,
        ...tracksQuerySecond.data?.items,
      ]);
    }
  }, [tracksQueryFirst, tracksQuerySecond]);

  const artistsPopularity = useMemo(() => {
    if (artistsQueryFirst.data && artistsQuerySecond.data) {
      return getAveragePopularity([
        ...artistsQueryFirst.data?.items,
        ...artistsQuerySecond.data?.items,
      ]);
    }
  }, [artistsQueryFirst, artistsQuerySecond]);

  if (tracksQueryFirst.isLoading || tracksQuerySecond.isLoading) {
    return <> </>;
  }

  return (
    <Wrapper>
      <select
        className="time-range"
        value={timeRange}
        onChange={(e) => {
          const val = e.target.value as
            | "medium_term"
            | "short_term"
            | "long_term";
          setTimeRange(val);
        }}
      >
        <option value="short_term">4 weeks</option>
        <option value="medium_term">6 months</option>
        <option value="long_term">All time</option>
      </select>

      <header>
        <h1>Top {isTracks ? "Tracks" : "Artists"}</h1>
      </header>
      <div className="fave-switch-container">
        <SwitchBtn
          className="fave-switch"
          isActive={isTracks}
          onClick={() => setIsTracks(true)}
        >
          Tracks
        </SwitchBtn>

        <SwitchBtn
          isActive={!isTracks}
          className="fave-switch"
          onClick={() => {
            setIsTracks(false);
          }}
        >
          Artists
        </SwitchBtn>
      </div>
      {isTracks ? (
        <div className="top-tracks-container">
          <TrackTile>
            <div></div>
            <h3>Popularity: </h3>
            <h3>{tracksPopularity}</h3>
          </TrackTile>
          {tracksQueryFirst.data?.items.map((x, i) => (
            <TrackTile data={x} place={i + 1} key={uuid()} />
          ))}
          {tracksQuerySecond.data?.items.map((x, i) => {
            if (i === 0) {
              return "";
            } else {
              return <TrackTile key={uuid()} data={x} place={i + 50} />;
            }
          })}
        </div>
      ) : (
        <div className="top-artists-container">
          <TrackTile className="popularity">
            <div></div>
            <h3>Popularity: </h3>
            <h3>{artistsPopularity}</h3>
          </TrackTile>
          {artistsQueryFirst.data?.items.map((x, i) => (
            <ArtistTile data={x} place={i + 1} key={uuid()} />
          ))}
          {artistsQuerySecond.data?.items.map((x, i) => {
            if (i === 0) {
              return "";
            } else {
              return <ArtistTile data={x} place={i + 50} key={uuid()} />;
            }
          })}
        </div>
      )}
      {isTracks ? <CreateButton>Create Playlist</CreateButton> : ""}
    </Wrapper>
  );

  // function reFetch(params:type) {

  // }
};

function getAveragePopularity(arr: Array<ResultArtist | ResultTrack>) {
  const total = arr.reduce(
    (prev: number, curr: ResultTrack | ResultArtist) => prev + curr.popularity,
    0
  );

  return Math.floor(total / arr.length);
}
