import React from "react";
import styled from "styled-components";
import { AudioFeature, RecoResults } from "../../../../types";
import { ProgressBar } from "../../../index";
import { ReactComponent as Spotify } from "../../../../static/spotify.svg";
import toPairsIn from "lodash.topairsin";
const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 7fr;
  gap: 1em;
  overflow: hidden;

  .reco-modal-img {
    width: 150px;
    border-radius: 4px;
  }
  .reco-modal-name {
    width: 100%;
    h3 {
      font-size: 1.8em;
      //Elipsis after 2 lines
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: fit-content;
    }
    .reco-modal-artists {
      font-weight: 300;
      //Elipsis after 1 line
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;

      height: fit-content;
    }
  }

  .reco-modal-stats {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    @media (max-width: 767px) {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
    gap: 1em;
    .reco-bar {
      display: inline;
      width: 100%;
      .reco-bar-label {
        font-weight: 200;
        @media (max-width: 768px) {
          font-size: 0.8em;
        }
      }
    }

    .reco-modal-links {
      display: flex;
      align-items: center;
      justify-content: space-between;
      a {
        height: 30px;
        #spotify-logo {
          width: 50px;
          height: 90%;
          fill: #1ed760;
        }
      }

      .reco-modal-preview {
        width: 50%;
        height: 30px;
        border-radius: 30px;
        position: relative;
      }
    }
  }

  @media (max-width: 768px) {
    .reco-modal-name {
      h3 {
        font-size: 1em;
      }
    }

    .reco-modal-img {
      width: 80px;
      border-radius: 4px;
    }
  }
`;

interface Props {
  currentReco: RecoResults;
  currentFeature: AudioFeature;
}

export const CurrentRecoModal: React.FC<Props> = ({
  currentReco,
  currentFeature,
}) => {
  const toPairsCurrentFeature = toPairsIn(currentFeature);
  return (
    <ModalContent>
      <img
        className="reco-modal-img"
        src={currentReco.album.images[1].url}
        alt=""
      />
      <div className="reco-modal-name">
        <h3>{currentReco.name}</h3>
        <p className="reco-modal-artists">
          {currentReco.artists.map((x, i, arr) => {
            return (
              <span key={x.id}>
                {x.name}
                {arr.length - 1 === i ? "" : ", "}{" "}
              </span>
            );
          })}
        </p>
      </div>
      <div className="reco-modal-stats">
        {toPairsCurrentFeature.map((x) => {
          if (x[0] === "id") {
            return "";
          } else {
            return (
              <div className="reco-bar" key={x[0]}>
                <p className="reco-bar-label">{x[0]}</p>
                <ProgressBar completed={x[1]} />
              </div>
            );
          }
        })}
        <div className="reco-bar">
          <p className="reco-bar-label">Popularity</p>
          <ProgressBar completed={currentReco.popularity} />
        </div>
        <div className="reco-modal-links">
          {currentReco.preview_url ? (
            <audio
              className="reco-modal-preview"
              src={currentReco.preview_url}
              controls
            />
          ) : (
            ""
          )}

          <a
            target="_blank"
            rel="noopener noreferrer"
            href={currentReco.external_urls.spotify}
          >
            <Spotify id="spotify-logo" />
          </a>
        </div>
      </div>
    </ModalContent>
  );
};
