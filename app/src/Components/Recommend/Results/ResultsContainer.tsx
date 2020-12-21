import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { ResultTile } from "./ResultTile";
import smoothscroll from "smoothscroll-polyfill";
import Modal from "react-modal";
import { CustomModalStyles } from "../defaultOptions";
import { useQuery } from "react-query";
import { getTrackFeatures } from "../../../functions/api";
import { ProgressBar } from "../../index";
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
      //Elipsis after 1 line
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;

      height: fit-content;
    }
  }
  .reco-modal-img {
    width: 120px;
    border-radius: 4px;
  }

  .reco-modal-stats {
    grid-column: 1/-1;
    p {
      opacity: 0.9;
      font-weight: 100;
    }
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 1.2em;
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
  const resultIds = results.map((res) => res.id);
  const features = useQuery(
    "features",
    () => getTrackFeatures(token!, resultIds),
    {
      onSuccess: (d) => {},
    }
  );

  const currentFeautre = features.data;
  console.log(results);
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
            <p className="thin">Popularity</p>
            <ProgressBar bgColor={"black"} completed={currentReco.popularity} />
          </div>
        </ModalContent>
      </Modal>
    </>
  );

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function setCurrentRecoState(data: RecoResults) {
    setCurrentReco(data);
  }
};

export default Results;
