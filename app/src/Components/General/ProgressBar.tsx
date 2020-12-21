import React from "react";
import styled from "styled-components";

const StyledProgressBar = styled.div<{ completed: number }>`
  height: 0.6em;
  width: 40%;
  border: 1px solid ${(props) => props.theme.light};
  background-color: none;
  border-radius: 50px;
  margin-bottom: 12px;
  .progress-bar-filler {
    height: 100%;
    width: ${(props) => props.completed}%;
    background-color: ${(props) => props.theme.secondary};
    border-radius: inherit;
    text-align: right;
    position: relative;
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
      right: -8%;
    }
    @media (max-width: 375px) {
      right: -10%;
    }
  }
`;
interface Props {
  bgColor: string;
  completed: number;
}

export const ProgressBar = (props: Props) => {
  const { completed } = props;

  return (
    <>
      <StyledProgressBar completed={completed}>
        <div className="progress-bar-filler">
          <span className="progress-bar-label">{completed}</span>
        </div>
      </StyledProgressBar>
    </>
  );
};
