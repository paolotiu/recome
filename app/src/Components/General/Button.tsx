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
  text?: string;
  link?: string;
  className?: string;
  onClick?:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
}

export const Button: React.FC<Props> = ({
  text,
  link = "",
  className,
  onClick,
  children,
}) => {
  if (link) {
    return (
      <a href={link} className={className}>
        <StyledButton type="button">{text}</StyledButton>
      </a>
    );
  } else {
    return (
      <StyledButton onClick={onClick} className={className}>
        {text}
        {children}
      </StyledButton>
    );
  }
};
