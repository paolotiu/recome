import React from "react";
import styled from "styled-components";

interface StyledProps {
  isAuto: boolean;
}
const StyledNumberInput = styled.div<StyledProps>`
  color: ${(props) => (props.isAuto ? "#888" : "#EEE")};
  transition: all 0.2s ease-in;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
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
  max?: number;
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
  max,
}) => {
  return (
    <StyledNumberInput isAuto={isAuto}>
      <label htmlFor={name}>{label} </label>
      {target ? (
        <>
          {" "}
          <input
            disabled={isAuto}
            type={type}
            name={name}
            value={value}
            max={max ? max : name === "max" ? 100 : target - 1}
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
