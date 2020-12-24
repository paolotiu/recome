import React from "react";
import styled from "styled-components";
import { ResultTrack } from "../../../types";
import { ResultTile } from "../../index";
import { Fade } from "react-awesome-reveal";
const StyledTrackTile = styled(ResultTile)`
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 1.2em;
  gap: 1em;
  grid-template-columns: 1fr 1fr 10fr;
  max-height: 200px;
  background-color: ${(props) => props.theme.darkBg};
  max-width: 700px;
  h3 {
    justify-self: auto;
    font-size: 1.8em;
  }
  img {
    width: 60px;
  }

  .fave-song-names {
    max-width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    h3 {
      font-size: 1.3em;
    }
    p {
      font-weight: 200;
      margin-top: 0.5em;
    }
  }
`;

interface Props {
  data?: ResultTrack;
  place?: number;
  className?: string;
}

export const TrackTile: React.FC<Props> = ({
  data,
  place,
  children,
  className,
}) => {
  return (
    <>
      {data && place ? (
        <Fade
          style={{ width: "100%" }}
          direction="up"
          cascade={true}
          triggerOnce={true}
        >
          <StyledTrackTile>
            <h3>{place}</h3>
            <img src={data.album.images[2].url} alt=" " width="60px" />
            <div className="fave-song-names">
              <h3>{data.name}</h3>
              <p>{data.album.artists[0].name}</p>
            </div>
          </StyledTrackTile>
        </Fade>
      ) : (
        <Fade
          className="whole-row"
          direction="up"
          cascade={true}
          triggerOnce={true}
        >
          <StyledTrackTile className={className}> {children}</StyledTrackTile>
        </Fade>
      )}
    </>
  );
};
