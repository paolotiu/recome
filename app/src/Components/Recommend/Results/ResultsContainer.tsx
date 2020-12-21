import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { ResultTile } from "./ResultTile";
import smoothscroll from "smoothscroll-polyfill";
import Modal from "react-modal";
import { CustomModalStyles } from "../defaultOptions";
import { useQuery } from "react-query";
import { getTrackFeatures } from "../../../functions/api";

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
      onSuccess: (d) => {
        console.log(d);
      },
    }
  );

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
        style={CustomModalStyles}
        onRequestClose={closeModal}
      >
        <img src={currentReco.album.images[1].url} alt="" />
        <h3>{currentReco.name}</h3>
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
