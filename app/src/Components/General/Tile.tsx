import styled from "styled-components";
export const Tile = styled.div`
  width: 230px;
  height: 256px;
  background-color: ${(props) => props.theme.lightenedDark};
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  padding: 1em 1.2em;
  line-height: 1.6em;

  h2 {
    font-size: 1.7em;
    color: ${(props) => props.theme.secondary};
  }
`;
