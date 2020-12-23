import React from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getTopArtists } from "../../functions/api";
import { CenterGrid } from "../General";

const Wrapper = styled(CenterGrid)`
  .favorites-container {
    display: grid;

    max-width: ${(props) => props.theme.maxContentWidth};
  }
`;
interface Props {}

export const Favorites = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const artistQuery = useQuery("artists", () => getTopArtists(token, 50));
  console.log(artistQuery);
  return (
    <Wrapper>
      <div className="favorites-container">
        <h1>Top</h1>
      </div>
    </Wrapper>
  );
};
