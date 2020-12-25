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

const Wrapper = styled(CenterGrid)`
  gap: 2em;
  padding: 2em;
  .photo-bg {
    height: 700px;
    width: 500px;
    background-color: white;
    display: grid;
  }
`;
export const Generate = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const [timeRange, setTimeRange] = useState<
    "medium_term" | "short_term" | "long_term"
  >("medium_term");
  const ref = useRef<HTMLDivElement>(null);
  const topTracks = useQuery<{ items: ResultTrack[] }>(
    ["tracks", "medium_term"],
    () => getTopTracks(token, 50, 0, timeRange)
  );
  const topArtists = useQuery<{ items: ResultArtist[] }>(
    ["artists", "medium_term"],
    () => getTopArtists(token, 50, 0, timeRange)
  );

  if (!topTracks.data || !topArtists.data) {
    return <> </>;
  }

  return (
    <Wrapper>
      <Photo
        refObj={ref}
        artistsData={topArtists.data.items}
        tracksData={topTracks.data.items}
      />
      <Button
        onClick={() => {
          const node = ref.current;
          const scale = 2;

          if (node) {
            const options = {
              quality: 0.99,
              width: node.clientWidth * 2,
              height: node.clientHeight * 2,
              style: {
                transform: "scale(" + scale + ")",
                transformOrigin: "top left",
              },
            };
            domtoimage.toPng(node, options).then((dataUrl) => {
              const img = new Image();
              img.src = dataUrl;
              document.body.appendChild(img);
            });
            // .toBlob(node, {
            //   quality: 0.99,
            //   width: node.clientWidth * 2,
            //   height: node.clientHeight * 2,
            //   style: {
            //     transform: "scale(" + scale + ")",
            //     transformOrigin: "top left",
            //   },
            // })
            // .then((blob) => {
            //   saveAs(blob, "recome");
            // });
          }
        }}
      >
        Generate
      </Button>
    </Wrapper>
  );
};
