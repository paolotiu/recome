import React from "react";
import styled from "styled-components";
import { CenterGrid, Tile } from "../index";
import github from "../../static/github.png";
import { ReactComponent as Gmail } from "../../static/gmail.svg";
const Wrapper = styled(CenterGrid)`
  display: flex;
  justify-items: center;
  place-items: center;
  margin-top: 50px;
  a {
    margin: 0 1em;
  }
  @media (max-width: 600px) {
    flex-direction: column;
    a {
      margin: 1em 0;
    }
  }
`;
const ContactTile = styled(Tile)`
  display: grid;
  height: 100%;
  grid-template-rows: 60% auto;
  min-height: 300px;
  .logo {
    justify-self: center;
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    p {
      color: ${(props) => props.theme.secondary};
      font-weight: 600;
    }
  }

  #gmail-logo {
    width: 90%;
  }
`;
interface Props {}

export const Contact = (props: Props) => {
  return (
    <Wrapper>
      <a
        href="https://github.com/paolotiu17/recome"
        style={{ height: "fit-content" }}
      >
        <ContactTile>
          <img
            src={github}
            alt="Github Logo"
            className="logo"
            width="100%"
            // height="100%"
          />

          <div className="text">
            <p>🌟 Star on</p>
            <h1>Github</h1>
          </div>
        </ContactTile>
      </a>

      <a href="mailto:gabrielpaolotiu@gmail.com?subject=Hey There!">
        <ContactTile>
          <Gmail className="logo" id="gmail-logo" />

          <div className="text">
            <p>📝 Send me an</p>
            <h1>Email</h1>
          </div>
        </ContactTile>
      </a>
    </Wrapper>
  );
};
