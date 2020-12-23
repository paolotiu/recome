import React from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { ResultTile as RT } from "../../index";
import { Fade } from "react-awesome-reveal";
import Mic from "../../../static/mic.png";

const StyledResultTile = styled(RT)`
  transform: translateZ(0);
  padding-right: 0.8em;
  .reco-song-names {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    h3 {
      font-size: 1.2em;
    }
    p {
      font-weight: 200;
      margin-top: 0.5em;
    }
  }

  ::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 130px;
    height: 130px;
    background-color: ${(props) => props.theme.imageBg};
    z-index: 0;
    border-radius: inherit;
    content: "";
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(90px, 1fr) 10fr;

    img {
      width: 60px;
    }
    .reco-song-names {
      max-width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      h3 {
        font-size: 1em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p {
        font-weight: 200;
        margin-top: 0.5em;
      }
    }

    ::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 87px;
      height: 87px;
      background-color: ${(props) => props.theme.secondary};
      z-index: 0;
      border-radius: inherit;
      content: "";
    }
  }
`;
interface Props {
  data: RecoResults;
  openModal: (e: any) => void;
  setCurrentRecoState: (data: RecoResults) => void;
}

export const RecoResultTile: React.FC<Props> = ({
  data,
  openModal,
  setCurrentRecoState,
}) => {
  return (
    <Fade
      style={{ width: "100%" }}
      triggerOnce={true}
      direction="left"
      cascade={true}
    >
      <StyledResultTile
        onClick={(e) => {
          setCurrentRecoState(data);
          openModal(e);
        }}
      >
        <img
          src={data.album.images[1] ? data.album.images[1].url : Mic}
          alt=""
        />
        <div className="reco-song-names">
          <h3>{data.name}</h3>
          <p>{data.album.artists[0].name}</p>
        </div>
      </StyledResultTile>
    </Fade>
  );
};
