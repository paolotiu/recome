import React, { useRef, useState } from "react";
import domtoimage from "dom-to-image";
import { useQuery } from "react-query";
import { getTopArtists, getTopTracks } from "../../functions/api";
import { Button, CenterGrid } from "../General";
import styled from "styled-components";
import { ResultArtist, ResultTrack } from "../../types";
import { Photo } from "./Photo/Photo";
import { saveAs } from "file-saver";
interface Props {}

const SwitchBtn = styled.button<{ isActive: boolean }>`
  border: none;
  font-size: clamp(20px, 2vw, 30px);
  font-weight: 700;
  white-space: nowrap;
  color: ${(props) =>
    props.isActive ? props.theme.secondary : props.theme.darkBg};

  background-color: transparent;
`;

const Wrapper = styled(CenterGrid)`
  gap: 2em;
  padding: 2em;
  .photo-bg {
    height: 700px;
    width: 500px;
    background-color: white;
    display: grid;
  }

  .gen-controls {
    display: grid;
    gap: 1em;
    div {
      display: grid;
      gap: 1em;
      grid-auto-flow: column;
    }
  }
`;
export const Generate = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const [isTracks, setIsTracks] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "medium_term" | "short_term" | "long_term"
  >("medium_term");
  const ref = useRef<HTMLDivElement>(null);
  const topTracks = useQuery<{ items: ResultTrack[] }>(
    ["tracks", timeRange],
    () => getTopTracks(token, 50, 0, timeRange)
  );
  const topArtists = useQuery<{ items: ResultArtist[] }>(
    ["artists", timeRange],
    () => getTopArtists(token, 50, 0, timeRange)
  );

  if (!topTracks.data || !topArtists.data) {
    return <> </>;
  }

  return (
    <Wrapper>
      <div className="gen-controls">
        <div>
          <SwitchBtn isActive={isTracks} onClick={() => setIsTracks(true)}>
            {" "}
            Tracks
          </SwitchBtn>
          <SwitchBtn isActive={!isTracks} onClick={() => setIsTracks(false)}>
            {" "}
            Artists
          </SwitchBtn>
        </div>
        <div>
          <SwitchBtn
            onClick={() => {
              setTimeRange("short_term");
            }}
            isActive={timeRange === "short_term"}
          >
            4 weeks
          </SwitchBtn>
          <SwitchBtn
            onClick={() => {
              setTimeRange("medium_term");
            }}
            isActive={timeRange === "medium_term"}
          >
            6 months
          </SwitchBtn>
          <SwitchBtn
            onClick={() => {
              setTimeRange("long_term");
            }}
            isActive={timeRange === "long_term"}
          >
            All time
          </SwitchBtn>
        </div>
      </div>
      <Photo
        isTracks={isTracks}
        refObj={ref}
        artistsData={topArtists.data.items}
        tracksData={topTracks.data.items}
        timeRange={timeRange}
      />

      <Button
        onClick={() => {
          const node = ref.current;
          const scale = 2;

          if (node) {
            const options = {
              quality: 1,
              width: node.clientWidth * 2,
              height: node.clientHeight * 2,
              style: {
                transform: "scale(" + scale + ")",
                transformOrigin: "top left",
              },
            };
            domtoimage.toBlob(node, options).then((blob) => {
              saveAs(blob, "recome");
            });
          }
        }}
      >
        Download
      </Button>
    </Wrapper>
  );
};
