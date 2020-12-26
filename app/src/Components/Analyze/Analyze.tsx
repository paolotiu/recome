import React from "react";
import { useQuery } from "react-query";
import { getAllSavedTracks } from "../../functions/api";

interface Props {}

export const Analyze = (props: Props) => {
  const token = localStorage.getItem("token")!;
  const allTracksQuery = useQuery("allTracks", () => getAllSavedTracks(token), {
    staleTime: Infinity,
  });
  return <div></div>;
};
