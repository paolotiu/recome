import React, { useState } from "react";
import Modal from "react-modal";
import { CenterGrid } from "../index";
import { OptionTile } from "./OptionTile/OptionTile";
import styled from "styled-components";
import { useQuery } from "react-query";
import { getTopArtists, getTopTracks } from "../../functions/api";
import { Options, TopResult } from "../../types";
import { defaultOptions } from "./defaultOptions";
import toPairsIn from "lodash.topairsin";
const CustomModalStyles = {
  overlay: {
    backgroundColor: "rgba(255,255,255, 0.2)",
  },
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -30%)",
    backgroundColor: "#393939",
    border: "none",
  },
};

const Wrapper = styled(CenterGrid)`
  display: flex;

  .option-tiles-container {
    width: 100%;
    align-items: center;
    justify-items: center;
    display: grid;
    max-width: 900px;
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
`;

interface Props {
  token: string;
}

const metricOptions = [
  "popularity",
  "acousticness",
  "danceability",
  "tempo",
  "energy",
  "instrumentalness",
  "liveness",
  "loudness",
  "mode",
  "speechiness",
  "time_signature",
  "valence",
  "duration",
];
Modal.setAppElement("#root");
export const Recommend: React.FC<Props> = ({ token }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState({
    name: "name",
    min: 0,
    max: 100,
    target: 50,
    isAuto: true,
  });
  const [options, setOptions] = useState<Options>(defaultOptions);
  const artistsQuery = useQuery("artists", () => getTopArtists(token), {
    // Set top artists and genres after fetching
    onSuccess: (data: TopResult) => {
      setOptions((prev) => {
        return {
          ...prev,
          seed_artists: data.items.map((item) => item.id),
          seed_genres: data.items.map((item) => item.genres[0]),
        };
      });
    },
  });

  const tracksQuery = useQuery("tracks", () => getTopTracks(token), {
    onSuccess: (data: TopResult) => {
      // Set top tracks after fetching
      setOptions((prev) => {
        return {
          ...prev,
          seed_tracks: data.items.map((item) => item.id),
        };
      });
    },
  });

  if (artistsQuery.isLoading || tracksQuery.isLoading) {
    return <> </>;
  }
  console.log(formatOptions(options));
  return (
    <Wrapper>
      <div className="option-tiles-container">
        {metricOptions.map((x, index) => (
          <OptionTile
            name={x}
            index={index}
            setOptions={setOptions}
            openModal={openModal}
            key={x}
          />
        ))}
      </div>
      <Modal
        style={CustomModalStyles}
        isOpen={showModal}
        onRequestClose={closeModal}
      >
        <h1>{currentOption.name}</h1>
      </Modal>
    </Wrapper>
  );

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function setCurrent(name: string, min: number, max: number) {}
};

function formatOptions(options: Options) {
  const x = toPairsIn(options).filter((x) => !x[0].startsWith("seed"));
  x.forEach((y) => (y[1] = toPairsIn(y[1])));
  const q: {
    [key: string]: number | boolean;
  } = {};
  x.forEach((y) => {
    const name = y[0];
    if (y[1][3][1]) {
      return;
    } else {
      y[1].forEach((z: any) => {
        if (z[0] === "isAuto") {
          return;
        }
        q[name + "_" + z[0]] = z[1];
      });
    }
  });
  return q;
}
