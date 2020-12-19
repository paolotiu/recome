import React, { useState, useEffect } from "react";
import "rc-slider/assets/index.css";
import { CenterGrid } from "../index";
import { OptionTile } from "./OptionTile/OptionTile";
import styled from "styled-components";
import { useQuery } from "react-query";
import {
  getTopArtists,
  getTopTracks,
  getRecommendations,
} from "../../functions/api";
import { Options, SeedOptions, SingleOption, TopResult } from "../../types";
import { defaulSeedOptions, defaultOptions } from "./defaultOptions";
import toPairsIn from "lodash.topairsin";
import { Slider } from "../index";
import Modal from "react-modal";

const CustomModalStyles = {
  overlay: {
    backgroundColor: "rgba(255,255,255, 0.2)",
  },
  content: {
    display: "grid",
    gap: "1.2em",
    top: "30%",
    left: "50%",
    width: "clamp(270px, 30vw, 500px)",
    right: "auto",
    bottom: "auto",

    marginRight: "-50%",
    transform: "translate(-50%, -30%)",
    backgroundColor: "#393939",
    border: "none",
    textTransform: "capitalize",
  } as React.CSSProperties,
};

const Wrapper = styled(CenterGrid)`
  display: flex;
  align-items: center;
  flex-direction: column;
  .option-tiles-container {
    width: 100%;
    align-items: center;
    justify-items: center;
    display: grid;
    max-width: 1000px;
    padding: 1em;
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  @media (max-width: 768px) {
    .option-tiles-container {
    }
  }
`;

interface Props {
  token: string;
}

Modal.setAppElement("#root");
export const Recommend: React.FC<Props> = ({ token }) => {
  const [showModal, setShowModal] = useState(false);
  const [seedOptions, setSeedOptions] = useState<SeedOptions>(
    defaulSeedOptions
  );

  const [options, setOptions] = useState<Options>(defaultOptions);
  const [currentOption, setCurrentOption] = useState<SingleOption>(
    options.acousticness
  );
  const optionArray = optionsToArray(options);
  const artistsQuery = useQuery("artists", () => getTopArtists(token), {
    // Set top artists and genres after fetching
    onSuccess: (data: TopResult) => {
      setSeedOptions((prev) => {
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
      setSeedOptions((prev) => {
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

  const { min, max, target, name, isAuto } = currentOption;

  //Button color switch
  let buttonBg = "#EEE";
  if (isAuto) {
    buttonBg = "#00ADB5";
  }

  //Change bad looking names
  let newName: string;
  if (name === "instrumentalness") {
    newName = "instrumentals";
  } else if (name === "time_signature") {
    newName = "Time Signature";
  } else {
    newName = name;
  }

  return (
    <Wrapper>
      <div className="option-tiles-container">
        {optionArray.map((x, index) => (
          <OptionTile
            name={x[0]}
            options={x[1]}
            index={index}
            setCurrent={setCurrent}
            openModal={openModal}
            key={x[0]}
          />
        ))}
      </div>

      <button onClick={() => getRecommendations(token, seedOptions, options)}>
        Send
      </button>
      <Modal
        style={CustomModalStyles}
        isOpen={showModal}
        onRequestClose={closeModal}
        onAfterClose={() => {
          changeOptions(name, min, max, target, isAuto);
        }}
      >
        <h1>{newName}</h1>

        <Slider
          min={0}
          max={100}
          value={[min, target, max]}
          tabIndex={[2, 3]}
          allowCross={false}
          tipFormatter={(value: any) => `${value}`}
          onChange={(val: any) => {
            if (isAuto) {
              setCurrentOption((prev) => {
                return { ...prev, isAuto: false };
              });
            }
            setCurrentOption((prev) => {
              return { ...prev, min: val[0], target: val[1], max: val[2] };
            });
          }}
          activeDotStyle={{
            boxShadow: "none",
            border: "none",
            background: "blue",
          }}
          pushable={true}
        />
        <div className="reco-input-container">
          <label htmlFor="min">Min: </label>
          <input
            disabled={isAuto}
            type="number"
            name="min"
            value={min}
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, min: Number(e.target.value) };
              });
            }}
          />
        </div>
        <div className="reco-input-container">
          <label htmlFor="target">Target: </label>
          <input
            disabled={isAuto}
            type="number"
            name="target"
            value={target}
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, target: Number(e.target.value) };
              });
            }}
          />
        </div>
        <div className="reco-input-container">
          <label htmlFor="max">Max: </label>
          <input
            disabled={isAuto}
            type="number"
            name="max"
            value={max}
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, max: Number(e.target.value) };
              });
            }}
          />
        </div>
        <button
          style={{
            border: "none",
            borderRadius: "24px",
            backgroundColor: buttonBg,
            outline: "none",
            transition: "all .3s ease-in",
          }}
          onClick={(e) => {
            setCurrentOption((prev) => {
              return { ...prev, isAuto: !prev.isAuto };
            });
          }}
        >
          Auto
        </button>
      </Modal>
    </Wrapper>
  );

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function setCurrent(name: string) {
    setCurrentOption(options[name]);
  }

  function changeOptions(
    name: string,
    min: number,
    max: number,
    target: number,
    isAuto: boolean
  ) {
    setOptions((prev: Options) => {
      return {
        ...prev,
        [name]: {
          min,
          max,
          target,
          isAuto,
          name,
        },
      };
    });
  }
};

function optionsToArray(options: Options) {
  return toPairsIn(options);
}

function optionsToObject(seedOptions: SeedOptions, options: Options) {
  const x = toPairsIn(seedOptions);
  let q = "";
  x.forEach((seed) => {
    q += seed[0] + "=" + seed[1].join(",");
    q += "&";
  });
  console.log(cleanOptions(options));
}

function cleanOptions(options: Options) {
  const cleanedOptions: { [key: string]: number } = {};
  for (let key in options) {
    const currentOption = options[key];
    if (!currentOption.isAuto) {
      const name = currentOption.name;
      const min = "min_" + name;
      const target = "target_" + name;
      const max = "max_" + name;
      switch (currentOption.name) {
        case "loudness":
          // Conversion to -60 - 100
          const convert = (x: number) => {
            return Math.floor(((x - 0) / (100 - 0)) * (0 - -60) + -60);
          };
          cleanedOptions[min] = convert(currentOption.min);
          cleanedOptions[max] = convert(currentOption.max);
          cleanedOptions[target] = convert(currentOption.target);

          break;
        case "popularity":
          cleanedOptions[min] = currentOption.min;
          cleanedOptions[max] = currentOption.max;
          cleanedOptions[target] = currentOption.target;
          break;
        default:
          // default 0.0 - 1.0
          cleanedOptions[min] = currentOption.min / 100;
          cleanedOptions[max] = currentOption.max / 100;
          cleanedOptions[target] = currentOption.target / 100;
          break;
      }
    }
  }
  return cleanedOptions;
}
