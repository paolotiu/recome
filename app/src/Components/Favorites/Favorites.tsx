import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTopArtists, getTopTracks } from "../../functions/api";
import { ResultArtist, ResultTrack } from "../../types";
import { CenterGrid, ResultTile, Tile } from "../General";
import { v4 as uuid } from "uuid";
import { TrackTile } from "./Tiles/TrackTile";
const Wrapper = styled(CenterGrid)`
  padding: 1em;
  justify-items: center;
  gap: 2em;
  h1 {
    width: 70vw;
  }
  .favorites-container {
    display: grid;
    gap: 0.8em;
    padding: 0 1em;
    max-width: 700px;
  }
`;
interface Props {}

export const Favorites = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const [isTracks, setIsTracks] = useState(true);
  const tracksQueryFirst = useQuery<{ items: ResultTrack[] }>(
    "tracks",
    () => getTopTracks(token, 50),
    {
      retry: 3,
    }
  );
  const tracksQuerySecond = useQuery<{ items: ResultTrack[] }>(
    "tracks2nd",
    () => getTopTracks(token, 50, 49)
  );
  const artistsQueryFirst = useQuery<{ items: ResultArtist[] }>("artists", () =>
    getTopArtists(token, 50)
  );
  const artistsQuerySecond = useQuery<{ items: ResultArtist[] }>(
    "artists2nd",
    () => getTopArtists(token, 50, 49)
  );

  if (
    !tracksQueryFirst.data ||
    !tracksQuerySecond.data ||
    !artistsQueryFirst.data ||
    !artistsQuerySecond.data
  ) {
    return <> </>;
  }

  const tracksData = [
    ...tracksQueryFirst.data.items,
    ...tracksQuerySecond.data.items,
  ];
  return (
    <Wrapper>
      <div>
        <button onClick={() => setIsTracks(true)}>Tracks</button>
        <button onClick={() => setIsTracks(false)}>Artists</button>
      </div>
      <h1>Top {isTracks ? "Tracks" : "Artists"}</h1>
      <div className="favorites-container">
        <TrackTile>
          <div></div>
          <h3>Popularity: </h3>
          <h3>{getAveragePopularity(tracksData)}</h3>
        </TrackTile>
        {isTracks ? (
          <>
            {tracksQueryFirst.data?.items.map((x, i) => (
              <TrackTile data={x} place={i + 1} key={uuid()} />
            ))}
            {tracksQuerySecond.data?.items.map((x, i) => (
              <>
                {i !== 0 ? (
                  <TrackTile data={x} place={i + 50} key={uuid()} />
                ) : (
                  ""
                )}
              </>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </Wrapper>
  );
};

function getAveragePopularity(arr: Array<ResultArtist | ResultTrack>) {
  const total = arr.reduce(
    (prev: number, curr: ResultTrack | ResultArtist) => prev + curr.popularity,
    0
  );
  return Math.floor(total / arr.length);
}
