import React from "react";
import styled from "styled-components";
import { ReactComponent as SVG } from "../../static/wave.svg";
const StyledWave = styled.div`
  z-index: -2;
  position: fixed;
  top: 0;
  right: 0;
  width: max(400px, 40vw);
  svg {
  }
  .z {
    transform: rotate(180deg);
    position: fixed;
    bottom: 0;
    left: 0;
    width: min(350px, 40vw);
  }

  .small-wave,
  .big-wave,
  .smaller-wave {
    position: absolute;
    top: 0;
  }

  .small-wave {
    fill: white;
    z-index: -1;
    opacity: 0.3;
    transform: scale(0.8);
    transform: translateY(-20%);
  }

  .smaller-wave {
    fill: white;
    opacity: 0.3;
    transform: scale(0.6);
    transform: translateY(-40%);
  }

  .big-wave {
    position: absolute;
    top: 0;
    z-index: -2;
    fill: ${(props) => props.theme.secondary};
  }

  @media (max-width: 600px) {
    width: min(500px, 70vw);
  }
  animation: move-wave 3s;
  -webkit-animation: move-wave 3s;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  @keyframes move_wave {
    0% {
      transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
      transform: translateX(-25%) translateZ(0) scaleY(0.55);
    }
    100% {
      transform: translateX(-50%) translateZ(0) scaleY(1);
    }
  }
`;

export const Wave: React.FC = () => {
  return (
    <StyledWave>
      <SVG className="smaller-wave" />
      <SVG className="small-wave" />

      <SVG className="big-wave" />
      <div className="z">
        <SVG className="smaller-wave" />
        <SVG className="small-wave" />
        <SVG className="big-wave" />
      </div>
    </StyledWave>
  );
};
