import React, { useRef } from "react";
import domtoimage from "dom-to-image";
import { useQuery } from "react-query";
import { getTopTracks } from "../../functions/api";
interface Props {}

export const Generate = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const ref = useRef<HTMLDivElement>(null);
  const topTracks = useQuery("top5tracks", () => getTopTracks(token, 5));

  return <div ref={ref}></div>;
};
