import React from "react";
import styled from "styled-components";
import { SingleOption } from "../../../types";
import { Tile } from "../../index";
import { lighten } from "polished";
interface StyledProps {
  show: boolean;
  isAuto: boolean;
}

export const StyledOptionTile = styled(Tile)<StyledProps>`
  cursor: pointer;
  transition: all 0.1s ease-in;
  /* display: ${(props) => (props.show ? "block" : "none")}; */
  background-color: ${(props) =>
    props.isAuto ? props.theme.lightenedDark : props.theme.secondary};
  width: 100%;
  height: auto;
  outline: none;
  h3 {
    font-size: 1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: capitalize;
  }

  p {
    font-size: 0.8em;
    font-weight: thin;
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    &:active {
      transform: scale(1.1);
      background-color: ${(props) =>
        props.isAuto
          ? lighten(0.04, props.theme.lightenedDark)
          : lighten(0.04, props.theme.secondary)};
    }
  }

  @supports not (-webkit-touch-callout: none) {
    &:hover,
    &:focus {
      transform: scale(1.1);
      background-color: ${(props) =>
        props.isAuto
          ? lighten(0.04, props.theme.lightenedDark)
          : lighten(0.04, props.theme.secondary)};
    }
  }

  @media (max-width: 768px) {
    width: 150px;
  }
  @media (max-width: 350px) {
    width: 100px;
    h3 {
      font-size: 100;
    }
  }
`;

interface Props {
  openModal: () => void;
  index: number;
  name: string;
  setCurrent: (name: string) => void;
  options: SingleOption;
}

export const OptionTile: React.FC<Props> = ({
  name,
  setCurrent,
  index,
  openModal,
  options,
}) => {
  const { min, max, target, isAuto } = options;
  let newName: string;
  if (name === "instrumentalness") {
    newName = "instrumentals";
  } else if (name === "time_signature") {
    newName = "Time Signature";
  } else {
    newName = name;
  }
  return (
    <StyledOptionTile
      isAuto={isAuto}
      show={index < 6}
      onClick={() => {
        setCurrent(name);
        openModal();
      }}
    >
      <h3>{newName}</h3>
      {isAuto ? (
        <p className="auto">Auto</p>
      ) : (
        <div>
          <p>Min: {min}</p>
          <p>Target: {target}</p>

          <p>Max: {max}</p>
        </div>
      )}
    </StyledOptionTile>
  );
};
