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
    opacity: 0.8;
    font-size: 10px;
    color: ${(props) => props.theme.light};
    font-weight: 100;
    position: absolute;
    right: -10%;
    top: 50%;
  }
`;
interface Props {
  bgColor: string;
  completed: number;
}

export const ProgressBar = (props: Props) => {
  const { bgColor, completed } = props;

  const labelStyles = {
    padding: 5,
    opacity: 0.8,
    fontSize: "10px",
    color: "white",
    fontWeight: 100,
    position: "absolue",
    right: -2,
    top: 4,
  };

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
