import React from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { Tile } from "../../index";
import { lighten } from "polished";
const StyledResultTile = styled(Tile)`
  display: grid;
  position: relative;
  background-color: ${(props) => props.theme.darkBg};
  width: 100%;
  z-index: 1;
  padding-top: 0.8em;
  padding-left: 0.8em;
  grid-template-columns: minmax(130px, 1fr) 2fr;
  height: fit-content;
  cursor: pointer;
  img,
  p,
  span {
    z-index: inherit;
  }
  img {
    width: 100px;
    position: relative;
    top: 0;
    left: 0;
    border-radius: 4px;
  }

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
    background-color: ${(props) => props.theme.secondary};
    z-index: 0;
    border-radius: inherit;
    content: "";
  }

  @media (max-width: 768px) {
    padding-top: 0.8em;
    padding-left: 0.8em;
    grid-template-columns: minmax(90px, 1fr) 4.2fr;

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
      width: 90px;
      height: 90px;
      background-color: ${(props) => props.theme.secondary};
      z-index: 0;
      border-radius: inherit;
      content: "";
    }
  }

  :hover {
    background-color: ${(props) => lighten(0.02, props.theme.darkBg)};
    transform: scale(1.04);
  }
`;
interface Props {
  data: RecoResults;
  openModal: () => void;
  setCurrentRecoState: (data: RecoResults) => void;
}

export const ResultTile: React.FC<Props> = ({
  data,
  openModal,
  setCurrentRecoState,
}) => {
  return (
    <StyledResultTile
      onClick={() => {
        setCurrentRecoState(data);
        openModal();
      }}
    >
      <img src={data.album.images[1].url} alt="" />
      <div className="reco-song-names">
        <h3>{data.name}</h3>
        <p>{data.album.artists[0].name}</p>
      </div>
    </StyledResultTile>
  );
};
