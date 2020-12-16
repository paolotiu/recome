import React from "react";
import styled from "styled-components";
import { ReactComponent as SVG } from "../../static/wave.svg";
const StyledWave = styled.div`
  z-index: -1;
  position: fixed;
  top: 0;
  right: 0;
  width: max(400px, 40vw);

  .z {
    transform: rotate(180deg);
    position: fixed;
    bottom: 0;
    left: 0;
    width: min(350px, 40vw);
  }

  @media (max-width: 600px) {
    width: min(500px, 70vw);
  }
`;

export const Wave: React.FC = () => {
  return (
    <StyledWave>
      <SVG />
      <div className="z">
        <SVG />
      </div>
    </StyledWave>
  );
};
