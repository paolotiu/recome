import React from "react";
import { Tile } from "../../index";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { lighten } from "polished";
interface Props {
  header?: string;
  desc?: string;
  icon?: any;
  path?: string;
  id?: string;
}

const StyledHomeTile = styled(Tile)`
  transition: background-color, transform 0.1s ease-in;

  padding: 2em 1.4em;
  svg {
    stroke: ${(props) => props.theme.light};
    stroke-width: 4px;
    width: 20%;
    height: 20%;
    /* fill: ${(props) => props.theme.background}; */
    overflow: visible;
    transition: fill 4s ease-in;
    path {
      fill: none;
    }
  }
  #heart {
    stroke-width: 2px;
  }
  #gears {
    stroke-width: 10px;
  }

  h2 {
    margin-top: 1.4em;
  }

  p {
    margin-top: 1em;
  }

  &:hover {
    background-color: ${(props) => lighten(0.04, props.theme.lightenedDark)};
    transform: translateY(-6px);
    svg {
      fill: ${(props) => props.theme.light};
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 1fr 5fr;

    align-items: baseline;
    justify-items: left;
    svg {
      max-height: 30px;
      justify-self: left;
      overflow: visible;
      height: 100%;
      width: auto;
    }
    h2 {
      line-height: 1em;
      padding: 0.1em;
      padding-bottom: 0;
      margin-top: 0;
    }
    p {
      grid-column: 1/3;
    }
  }
`;

export const HomeTile: React.FC<Props> = ({
  header,
  desc,
  icon,
  path = "",
  id,
}) => {
  return (
    <Link to={path} id={id}>
      <StyledHomeTile>
        {icon ? icon() : ""}

        <h2>{header}</h2>
        <p>{desc}</p>
      </StyledHomeTile>
    </Link>
  );
};
