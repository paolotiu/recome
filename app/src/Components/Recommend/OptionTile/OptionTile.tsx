import React, { useState } from "react";
import styled from "styled-components";
import { Options } from "../../../types";
import { Tile } from "../../index";

interface StyledProps {
  show: boolean;
}

const StyledOptionTile = styled(Tile)<StyledProps>`
  display: ${(props) => (props.show ? "block" : "none")};
  width: 100%;
  height: auto;
  h3 {
    font-size: 1em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 768px) {
    width: 150px;
  }
`;

interface Props {
  openModal: () => void;
  index: number;
  name: string;
  setOptions: React.Dispatch<React.SetStateAction<Options>>;
}

export const OptionTile: React.FC<Props> = ({
  name,
  setOptions,
  index,
  openModal,
}) => {
  const [isAuto, setIsAuto] = useState(true);
  const [min, setMin] = useState<number>(0);
  const [max, setMax] = useState<number>(100);
  const [target, setTarget] = useState(50);

  return (
    <StyledOptionTile show={index < 6} onClick={openModal}>
      <h3>{name}</h3>
      {isAuto ? <h2>Auto</h2> : <p>min: {min}</p>}
    </StyledOptionTile>
  );
};
