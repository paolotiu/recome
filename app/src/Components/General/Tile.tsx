import styled from "styled-components";
import { lighten } from "polished";
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

export const ResultTile = styled(Tile)`
  display: grid;
  position: relative;
  background-color: ${(props) => props.theme.darkBg};
  width: 100%;
  z-index: 1;
  padding: 0.8em 0.3em 0.8em 0.8em;

  grid-template-columns: minmax(130px, 1fr) 2fr;
  height: fit-content;
  cursor: pointer;

  img,
  p,
  span {
    z-index: inherit;
  }
  img {
    width: 100px;
    position: relative;
    top: 0;
    left: 0;
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    grid-template-columns: minmax(90px, 1fr) 10fr;

    img {
      width: 60px;
    }
  }

  @supports (-webkit-touch-callout: none) {
    /* CSS specific to iOS devices */
    :active {
      background-color: ${(props) => lighten(0.02, props.theme.darkBg)};
      transform: scale(1.04);
    }
  }

  @supports not (-webkit-touch-callout: none) {
    /* CSS for other than iOS devices */
    :hover {
      background-color: ${(props) => lighten(0.02, props.theme.darkBg)};
      transform: scale(1.04);
    }
  }
`;
