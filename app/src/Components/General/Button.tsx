import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border: none;
  background-color: ${(props) => props.theme.buttonBg};
  color: ${(props) => props.theme.buttonText};
  font-family: ${(props) => props.theme.mainFont};
  font-weight: bold;
  font-size: 2em;
  padding: 0.4em 0;
  border-radius: 0.3em;
  outline: none;
  width: 100%;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

interface Props {
  style?: React.CSSProperties;
  text?: string;
  link?: string;
  className?: string;
  onClick?:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  refObj?: React.RefObject<HTMLButtonElement>;
  id?: string;
}

export const Button: React.FC<Props> = ({
  text,
  link = "",
  className,
  onClick,
  children,
  style,
  disabled,
  type = "button",
  refObj,
  id,
}) => {
  if (link) {
    return (
      <a href={link} className={className}>
        <StyledButton type={type} id={id}>
          {text}
        </StyledButton>
      </a>
    );
  } else {
    return (
      <StyledButton
        ref={refObj}
        onClick={onClick}
        className={className}
        style={style}
        disabled={disabled}
        type={type}
        id={id}
      >
        {text}
        {children}
      </StyledButton>
    );
  }
};
