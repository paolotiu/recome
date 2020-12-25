import React, { useEffect } from "react";
import styled from "styled-components";
import { ResultArtist, ResultTrack } from "../../../types";
import { v4 as uuid } from "uuid";
const StyledPhoto = styled.div`
  width: 500px;
  max-width: 70vw;
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

  /* width: clamp(320px, 50vw, 500px); */
  .photo-track-container {
    display: grid;
    align-items: center;
    gap: 2em;
    grid-template-columns: auto auto 1fr;

    img {
      width: clamp(50px, 10vw, 100px);
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

  @media (max-width: 400px) {
    max-width: 85vw;
  }

  @media (max-width: 320px) {
    max-width: 90vw;
  }
`;
interface Props {
  refObj: React.RefObject<HTMLDivElement>;
  artistsData: ResultArtist[];
  tracksData?: ResultTrack[];
}

export const Photo: React.FC<Props> = ({ refObj, artistsData, tracksData }) => {
  const artists = artistsData.slice(0, 5);
  const tracks = tracksData ? tracksData.slice(0, 5) : null;

  return (
    <StyledPhoto ref={refObj}>
      <header>
        <h1>Top Tracks</h1>
        <p>Last 6 months</p>
      </header>

      {tracks?.map((x, i) => {
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
      })}
    </StyledPhoto>
  );
};
