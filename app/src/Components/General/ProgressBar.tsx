import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CountUp from "react-countup";
const StyledProgressBar = styled.div<{ completed: number }>`
  height: 0.6em;
  width: 100%;
  border: 1px solid ${(props) => props.theme.light};
  background-color: transparent;
  border-radius: 50px;
  margin-bottom: 12px;
  z-index: 3;
  .progress-bar-filler {
    height: 100%;
    width: ${(props) => props.completed}%;
    transform: translateZ(0);
    background-color: ${(props) => props.theme.secondary};
    border-radius: 100px;
    text-align: right;
    position: relative;
    transition: width 3s ease-in-out;
  }

  .progress-bar-label {
    padding: 5px;
    font-size: 10px;
    color: ${(props) => props.theme.light};
    font-weight: 100;
    position: absolute;
    right: -3%;

    top: 50%;
    @media (max-width: 1024px) {
      right: -6%;
    }
    @media (max-width: 768px) {
      right: -4%;
    }
    @media (max-width: 375px) {
      right: -10%;
    }
    left: ${(props) => (props.completed < 10 ? 0 : "auto")};
  }

  .low-num {
    left: 2px;
    @media (max-width: 768px) {
    }
  }
`;
interface Props {
  completed: number;
}

export const ProgressBar = (props: Props) => {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCompleted(props.completed);
    }, 100);
  }, [props.completed]);
  return (
    <>
      <StyledProgressBar completed={completed}>
        <div className="progress-bar-filler">
          <span className="progress-bar-label">
            <CountUp
              duration={4}
              easingFn={(t, b, c, d) => {
                var ts: number = (t /= d) * t;
                var tc: number = ts * t;
                return b + c * (tc + -3 * ts + 3 * t);
              }}
              end={completed}
            />
          </span>
        </div>
      </StyledProgressBar>
    </>
  );
};
