import React, { useEffect } from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { ResultTile } from "./ResultTile";
import smoothscroll from "smoothscroll-polyfill";

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
    <RecoResultsWrapper id="reco-results">
      <h1>Results</h1>
      {results.map((data) => {
        return <ResultTile key={data.id} data={data} />;
      })}
      {/* <Modal
        isOpen={true}
        style={CustomModalStyles}
        shouldCloseOnOverlayClick={true}
      ></Modal> */}
    </RecoResultsWrapper>
  );
};

export default Results;
