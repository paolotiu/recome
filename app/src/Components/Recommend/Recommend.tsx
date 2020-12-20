import React, { useState } from "react";
import "rc-slider/assets/index.css";
import { CenterGrid } from "../index";
import { OptionTile } from "./OptionTile/OptionTile";
import styled from "styled-components";
import { useQuery } from "react-query";
import { ReactComponent as Help } from "../../static/help-circle.svg";
import {
  getTopArtists,
  getTopTracks,
  getRecommendations,
} from "../../functions/api";
import { Options, SeedOptions, SingleOption, TopResult } from "../../types";
import {
  defaulSeedOptions,
  defaultOptions,
  CustomModalStyles,
  helpTip,
} from "./defaultOptions";
import toPairsIn from "lodash.topairsin";
import { Slider } from "../index";
import Modal from "react-modal";
import { Button } from "../General";
import ReactTooltip from "react-tooltip";

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
  button {
    margin-top: 1em;
    font-size: 1em;
    width: 90%;
    max-width: 960px;
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

  const resultsQuery = useQuery(
    "results",
    () => getRecommendations(token, seedOptions, options),
    {
      enabled: false,
      onSuccess: (d) => {
        console.log(d);
      },
    }
  );

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
    <>
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

        <Button
          onClick={() => resultsQuery.refetch()}
          //Disabled white fetching
          disabled={artistsQuery.isLoading || tracksQuery.isLoading}
        >
          Get Recommendations
        </Button>

        <Modal
          style={CustomModalStyles}
          isOpen={showModal}
          onRequestClose={closeModal}
          onAfterClose={() => {
            changeOptions(name, min, max, target, isAuto);
          }}
        >
          <h1>{newName}</h1>

          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a data-tip="custom show" data-event="click focus">
            <Help className="reco-tooltip" />
          </a>

          <ReactTooltip
            overridePosition={({ left }) => {
              return { left: left, top: -50 };
            }}
            className="reco-tip"
            place="left"
            type="dark"
            effect="float"
            globalEventOff="click"
          >
            {helpTip[name] ? helpTip[name] : "Nada"}
          </ReactTooltip>
          <Slider
            min={0}
            max={100}
            marks={{ 0: <span>0</span>, 100: <span>100</span> }}
            value={[min, target, max]}
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
            pushable={true}
          />
          <div className="reco-input-container">
            <label htmlFor="min">Min: </label>
            <input
              disabled={isAuto}
              type="number"
              name="min"
              value={min}
              max={target - 1}
              min={0}
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
              min={target + 1}
              max={100}
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
              color: isAuto ? "white" : "black",
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
      {resultsQuery.isSuccess
        ? resultsQuery.data.map((x: any) => {
            return <p>{x.name!}</p>;
          })
        : ""}
    </>
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
