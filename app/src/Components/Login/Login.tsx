import React from "react";
import { Button } from "../General/index";
import { ReactComponent as Bird } from "../../static/bird.svg";
import styled from "styled-components";
import ReactGA from "react-ga";
ReactGA.pageview("/login");
const link =
  process.env.REACT_APP_LOGIN_URL ||
  "http://localhost:8888/.netlify/functions/login";

const StyledLogin = styled.div`
  main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    width: 100%;
    justify-content: center;

    padding: 1em 2em;
    grid-template-columns: 300px 400px;
    grid-template-areas: "svg text" "button button";
    align-items: center;
    column-gap: 3em;
    row-gap: 3em;

    .bird-svg {
      max-height: 300px;

      grid-area: svg;
      fill: initial;
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
      color: ${(props) => props.theme.secondary};
    }
  }

  @media (max-width: 768px) {
    main {
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
          <Bird width="100%" height="100%" className="bird-svg" />
          <div className="text">
            <h1>Search for</h1>
            <h1>recommendations</h1>
            <h1>
              <span className="accented">exactly</span> how you want it
            </h1>
          </div>
          <Button text="Login to Spotify" className="loginbtn" link={link} />
        </main>
      </StyledLogin>
    </div>
  );
};
