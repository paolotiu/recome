import React from "react";
import styled from "styled-components";
import { ResultArtist, ResultTrack } from "../../../types";
import { v4 as uuid } from "uuid";
import { darken } from "polished";
const StyledPhoto = styled.div`
  width: 500px;
  max-width: 70vw;
  position: relative;
  background-color: ${(props) => props.theme.darkBg};
  color: ${(props) => props.theme.secondary};
  padding: 2em;
  display: grid;
  gap: 1em;
  align-items: center;
  header {
    display: flex;
    flex-direction: column;
    h1 {
      font-size: clamp(30px, 6vw, 50px);
    }
    p {
      font-size: clamp(5px, 1.8vw, 12px);
    }
  }

  .gen-artist-photo {
    display: flex;
    justify-content: center;
    position: relative;
    height: 100px;

    img {
      box-shadow: -10px -10px ${(props) => props.theme.secondary};
    }
  }

  .gen-artists-list {
    display: flex;
    flex-direction: column;
    li {
      list-style-position: inside;
      padding: 1em;
      margin: 1em;
      background-color: ${(props) => darken(0.11, props.theme.background)};
      box-shadow: -10px -10px ${(props) => props.theme.secondary};
    }
  }

  /* width: clamp(320px, 50vw, 500px); */
  .photo-track-container {
    display: grid;
    align-items: center;
    gap: 2em;
    grid-template-columns: auto auto 1fr;

    img {
      width: clamp(80px, 10vw, 100px);
    }
    .photo-track-container-name {
      h3 {
        width: fit-content;
        overflow-wrap: break-word;
        font-size: clamp(14px, 2vw, 20px);
        color: ${(props) => props.theme.light};
      }
      p {
        font-size: clamp(10px, 2vw, 20px);
        width: fit-content;
      }
      display: grid;
    }
  }

  .watermark {
    position: absolute;
    right: 2px;
    bottom: 0;
    font-size: clamp(8px, 1vw, 12px);
  }

  @media (max-width: 400px) {
    max-width: 85vw;
  }

  @media (max-width: 320px) {
    max-width: 90vw;
  }
`;

const rangeValues: { [key: string]: string } = {
  short_term: "Last 4 weeks",
  medium_term: "Last 6 months",
  long_term: "All time",
};
interface Props {
  refObj: React.RefObject<HTMLDivElement>;
  artistsData: ResultArtist[];
  tracksData?: ResultTrack[];
  timeRange: string;
  isTracks: boolean;
}

export const Photo: React.FC<Props> = ({
  refObj,
  artistsData,
  tracksData,
  timeRange,
  isTracks,
}) => {
  const range = rangeValues[timeRange];
  const artists = artistsData.slice(0, 5);
  const tracks = tracksData ? tracksData.slice(0, 5) : null;

  return (
    <StyledPhoto ref={refObj}>
      <header>
        <h1>Top {isTracks ? "Tracks" : "Artists"}</h1>
        <p>{range}</p>
      </header>

      {isTracks ? (
        tracks?.map((x, i) => {
          return (
            <div key={uuid()} className="photo-track-container">
              <h3>{i + 1}.</h3>
              <img src={x.album.images[1].url} alt="" />
              <div className="photo-track-container-name">
                <h3>{x.name}</h3>
                <p>{x.artists[0].name}</p>
              </div>
            </div>
          );
        })
      ) : (
        <>
          <div className="gen-artist-photo">
            <img
              src={artists[0].images[1].url}
              alt=""
              width="100px"
              height="100px"
            />
            {/* {artists.map((x) => (
              <img
                src={x.images[1].url}
                key={uuid()}
                alt=""
                width="100px"
                height="100px"
              />
            ))} */}
          </div>
          <ol className="gen-artists-list">
            {artists.map((x) => (
              <li key={uuid()}>{x.name}</li>
            ))}
          </ol>
        </>
      )}
      <span className="watermark">recome.net</span>
    </StyledPhoto>
  );
};
