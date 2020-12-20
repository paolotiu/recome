import React, { useEffect } from "react";
import styled from "styled-components";
import { RecoResults } from "../../../types";
import { ResultTile } from "./ResultTile";
const RecoResultsWrapper = styled.section`
  padding-top: 50px;
  grid-column: 1/-1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
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
    console.log(header);
    header?.scrollIntoView();
  }, [results]);

  if (!results.length) {
    return <> BRuh</>;
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
