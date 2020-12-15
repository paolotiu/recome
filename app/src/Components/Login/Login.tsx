import React from "react";
import { Button } from "../General/index";
import { ReactComponent as Bird } from "../../static/bird.svg";
import { ReactComponent as Wave } from "../../static/wave.svg";
import styled from "styled-components";
interface Props {}

const StyledLogin = styled.div`
  main {
    display: grid;
    width: 100%;
    justify-content: center;
    height: 50vh;
    padding: 1em 2em;
    grid-template-columns: 300px 400px;
    grid-template-areas: "svg text" "button button";
    margin-top: 200px;
    align-items: center;
    column-gap: 3em;
    row-gap: 0;

    svg {
      grid-area: svg;
    }

    .text {
      margin-top: 40px;
      max-width: 500px;
      grid-area: text;
    }

    .loginbtn {
      grid-area: button;
      max-width: 400px;
      width: 100%;
      justify-self: center;
    }
    h1 {
      margin: 0;
      font-size: 3em;
    }

    span {
      color: ${(props) => props.theme.accent};
    }
  }

  @media (max-width: 768px) {
    main {
      margin-top: 0;
      grid-template-columns: 300px;
      row-gap: 2em;
      grid-template-areas: "text" "button" "svg";
      .text {
        h1 {
          font-size: 2em;
        }
      }

      svg {
        height: 20vh;
      }
    }
  }
`;
export const Login: React.FC = () => {
  return (
    <div>
      <StyledLogin>
        <main>
          <Bird width="100%" height="100%" />
          <div className="text">
            <h1>Search for</h1>
            <h1>recommendations</h1>
            <h1>
              <span className="accented">exactly</span> how you want it
            </h1>
          </div>
          <Button
            text="Login to Spotify"
            className="loginbtn"
            link="http://localhost:8888/login"
          />
        </main>
      </StyledLogin>
    </div>
  );
};
