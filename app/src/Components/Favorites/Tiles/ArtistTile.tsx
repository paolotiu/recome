import React from "react";
import styled from "styled-components";
import { ResultArtist } from "../../../types";
import { Tile } from "../../index";
import { Fade } from "react-awesome-reveal";
import Mic from "../../../static/mic.png";

const StyledArtistTile = styled(Tile)`
  overflow: hidden;
  justify-content: space-between;
  align-items: center;
  position: relative;
  grid-template-columns: 1fr;
  padding: 0 0.8em 2.8em 0.8em;
  width: 100%;
  max-width: 100%;
  background-color: ${(props) => props.theme.darkBg};
  .artist-image-container {
    height: 150px;
    width: 150px;
  }
  h3 {
    text-align: center;
    margin-top: 10px;
    font-size: clamp(1.2em, 50%, 3em);
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 500px;
  }

  .place {
    z-index: 2;
    justify-self: flex-start;
    margin-right: auto;
    top: 1px;
    left: 3px;
  }

  :before {
    content: "";
    position: absolute;
    top: -40px;
    left: 0px;
    width: 40px;

    height: 120px;
    transform: rotate(45deg);
    background-color: ${(props) => props.theme.secondary};
  }

  @media (max-width: 768px) {
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 200px;

    .artist-image-container {
      height: 100px;
      width: 100px;
    }
  }
`;
interface Props {
  data?: ResultArtist;
  place?: number;
}

export const ArtistTile: React.FC<Props> = ({ data, children, place }) => {
  if (data && place) {
    return (
      <Fade
        style={{ width: "100%" }}
        triggerOnce={true}
        direction="up"
        cascade={true}
      >
        <StyledArtistTile>
          <h3 className="place">{place}</h3>
          <div className="artist-image-container">
            <img
              src={data.images[1] ? data.images[1].url : Mic}
              alt={`${data.name}`}
            />
          </div>
          <h3>{data.name}</h3>
        </StyledArtistTile>
      </Fade>
    );
  } else {
    return <StyledArtistTile>{children}</StyledArtistTile>;
  }
};
