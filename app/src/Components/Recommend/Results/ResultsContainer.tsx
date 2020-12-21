import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AudioFeature, RecoResults } from "../../../types";
import { ResultTile } from "./ResultTile";
import smoothscroll from "smoothscroll-polyfill";
import Modal from "react-modal";
import { CustomModalStyles, defaultFeature } from "../defaultOptions";
import { useQuery } from "react-query";
import { getTrackFeatures } from "../../../functions/api";
import { ProgressBar } from "../../index";
import toPairsIn from "lodash.topairsin";
import { useHistory } from "react-router";
// import { ReactComponent as Play } from "../../../static/play.svg";
// import { ReactComponent as Pause } from "../../../static/pause.svg";
import { ReactComponent as Spotify } from "../../../static/spotify.svg";
Modal.setAppElement("#root");
// kick off the polyfill!
smoothscroll.polyfill();
const RecoResultsWrapper = styled.section`
  padding-top: 50px;
  grid-column: 1/-1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;

  .no-reco-result {
    text-align: center;
    grid-column: 1/-1;
  }
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 7fr;
  gap: 1em;
  overflow: hidden;
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

      a {
        height: 30px;
        #spotify-logo {
          width: 30px;
          height: 90%;
          fill: #1ed760;
        }
      }

      .reco-modal-player {
        width: 40px;
        height: 40px;
        padding-top: 0.4em;
        padding-left: 0.3em;
        border-radius: 30px;
        position: relative;
        background-color: ${(props) => props.theme.light};
        svg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
        }
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
  results: RecoResults[];
}

const Results: React.FC<Props> = ({ results }) => {
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReco, setCurrentReco] = useState<RecoResults>(results[0]);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<AudioFeature>(
    defaultFeature
  );
  const history = useHistory();
  const resultIds = results.map((res) => res.id);
  const features = useQuery(
    "features",
    () => getTrackFeatures(token!, resultIds),
    {
      onSuccess: (e) => {
        console.log(e);
      },
      onError: (e) => {
        console.log(e);
        history.push("/");
      },
    }
  );
  useEffect(() => {
    if (features.isSuccess && features.data.audio_features) {
      const raw = (features.data.audio_features as AudioFeature[]).find(
        (x) => x.id === currentReco.id
      );

      if (raw) {
        const cleaned: AudioFeature = {
          id: raw.id,
          acousticness: multiply100(raw.acousticness),
          danceability: multiply100(raw.danceability),
          energy: multiply100(raw.energy),
          instrumentalness: multiply100(raw.instrumentalness),
          loudness: convert(raw.loudness),
          liveness: multiply100(raw.liveness),
          speechiness: multiply100(raw.speechiness),
          valence: multiply100(raw.valence),
        };
        setCurrentFeature(cleaned);
      }
    }
  }, [currentReco, features]);
  useEffect(() => {
    const header = document.querySelector("#reco-results");

    header?.scrollIntoView({ behavior: "smooth" });
  }, [results]);

  if (!results.length) {
    return (
      <RecoResultsWrapper id="reco-results">
        <div className="no-reco-result">
          <p>😭</p> No songs found for you
        </div>
      </RecoResultsWrapper>
    );
  }
  console.log(currentReco);
  const toPairsCurrentFeature = toPairsIn(currentFeature);
  return (
    <>
      <RecoResultsWrapper id="reco-results">
        <h1>Results</h1>
        {results.map((data) => {
          return (
            <ResultTile
              key={data.id}
              data={data}
              openModal={openModal}
              setCurrentRecoState={setCurrentRecoState}
            />
          );
        })}
      </RecoResultsWrapper>

      <Modal
        isOpen={isModalOpen}
        style={{
          overlay: {
            ...CustomModalStyles.overlay,
          },
          content: {
            ...CustomModalStyles.content,
            width: "clamp(400px, 90vw, 800px)",
          },
        }}
        onRequestClose={closeModal}
      >
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
                return <> </>;
              } else {
                return (
                  <div className="reco-bar">
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={currentReco.external_urls.spotify}
              >
                <Spotify id="spotify-logo" />
              </a>
              {/* <button onClick={playAudio} className="reco-modal-player">
                {isPlaying ? <Pause /> : <Play />}
              </button> */}
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal(
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>
  ) {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    setIsModalOpen(false);
  }

  function setCurrentRecoState(data: RecoResults) {
    setCurrentReco(data);
  }
  // function playAudio() {
  //   const audio: HTMLAudioElement | null = document.querySelector(
  //     "#reco-modal-preview"
  //   );
  //   if (audio) {
  //     if (isPlaying) {
  //       audio.pause();
  //       setIsPlaying(false);
  //     } else {
  //       audio.play();
  //       setIsPlaying(true);
  //     }
  //   }
  // }
};

export default Results;

function multiply100(num: number) {
  return Math.round(num * 100);
}

function convert(x: number) {
  return Math.floor(((x - -60) / (0 - -60)) * (100 - 0) + 0);
}
