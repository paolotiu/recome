import React from "react";
import styled from "styled-components";

interface StyledProps {
  isAuto: boolean;
}
const StyledNumberInput = styled.div<StyledProps>`
  color: ${(props) => (props.isAuto ? "#888" : "#EEE")};
  transition: all 0.2s ease-in;

  input {
    width: 50px;
    padding: 0 0.3em;
    border: none;
    color: inherit;
    background-color: transparent;
    outline: none;
  }
`;
interface Props {
  isAuto: boolean;
  type: string;
  name: string;
  target?: number;
  value: number;
  label: string;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
}

export const NumberInput: React.FC<Props> = ({
  isAuto,
  value,
  target,
  label,
  onChange,
  name,
  type,
}) => {
  return (
    <StyledNumberInput isAuto={isAuto}>
      <label htmlFor="min">{label} </label>
      {target ? (
        <>
          {" "}
          <input
            disabled={isAuto}
            type={type}
            name={name}
            value={value}
            max={name === "max" ? 100 : target - 1}
            min={name === "min" ? 0 : target + 1}
            onChange={onChange}
          />
        </>
      ) : (
        <>
          <input
            disabled={isAuto}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
          />
        </>
      )}
    </StyledNumberInput>
  );
};
