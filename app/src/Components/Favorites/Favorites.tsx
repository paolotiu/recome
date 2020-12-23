import React from "react";
import styled from "styled-components";
import { CenterGrid } from "../General";

const Wrapper = styled(CenterGrid)`
  .favorites-container {
    max-width: ${(props) => props.theme.maxContentWidth};
  }
`;
interface Props {}

export const Favorites = (props: Props) => {
  return (
    <Wrapper>
      <div className="favorites-container">
        <h1>Hello</h1>
      </div>
    </Wrapper>
  );
};
