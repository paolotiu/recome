import React, { useCallback, useState, useEffect } from "react";

import { CenterGrid, Modal } from "../index";
import { OptionTile } from "./OptionTile/OptionTile";
import styled from "styled-components";
import { useQuery } from "react-query";
import { ReactComponent as Help } from "../../static/help-circle.svg";
import {
  getTopArtists,
  getTopTracks,
  getRecommendations,
} from "../../functions/api";
import {
  Options,
  RecoResults,
  SeedOptions,
  SingleOption,
  TopResult,
} from "../../types";
import { defaulSeedOptions, defaultOptions, helpTip } from "./defaultOptions";
import toPairsIn from "lodash.topairsin";
import { Slider } from "../index";
import { Button } from "../General";
import ReactTooltip from "react-tooltip";
import { NumberInput } from "./NumberInput/NumberInput";
import Results from "./Results/ResultsContainer";
import { useHistory } from "react-router";
import { toast } from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import ReactGA from "react-ga";

const Wrapper = styled(CenterGrid)`
  display: flex;
  align-items: center;
  flex-direction: column;

  .option-tiles-container {
    width: 100%;
    align-items: center;
    justify-items: center;
    display: grid;
    max-width: ${(props) => props.theme.maxContentWidth};
    padding: 1em;
    gap: 1em;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    .option-tiles-header {
      grid-column: 1/-1;
    }
  }
  button {
    margin-top: 1em;
    font-size: 1em;
    width: 100%;
    max-width: 960px;
  }

  @media (max-width: 768px) {
    .option-tiles-container {
      h1 {
        font-size: 3em;
      }
    }
  }

  @media (max-width: 425px) {
    .option-tiles-container {
      h1 {
        font-size: 2.1em;
      }
    }
  }
  // To prevent vertical all
  @media (max-width: 350px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    .option-tiles-container {
      h1 {
        font-size: 1.8em;
      }
    }
  }
`;

interface Props {}

export const Recommend: React.FC<Props> = () => {
  useEffect(() => {
    ReactGA.pageview("/recommend");
  }, []);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seedOptions, setSeedOptions] = useState<SeedOptions>(
    defaulSeedOptions
  );

  const history = useHistory();
  const [options, setOptions] = useState<Options>(defaultOptions);
  const [currentOption, setCurrentOption] = useState<SingleOption>(
    options.acousticness
  );
  const openModal = useCallback(() => setIsModalOpen(true), []);
  const setCurrent = useCallback(
    (item: string) => setCurrentOption(options[item]),
    [options]
  );
  const optionArray = optionsToArray(options);
  const artistsQuery = useQuery("artists", () => getTopArtists(token!), {
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
    onError: () => {
      localStorage.removeItem("token");
      history.push("/login");
    },
    staleTime: 50000,
  });

  const tracksQuery = useQuery("tracks", () => getTopTracks(token!), {
    onSuccess: (data: TopResult) => {
      // Set top tracks after fetching
      setSeedOptions((prev) => {
        return {
          ...prev,
          seed_tracks: data.items.map((item) => item.id),
        };
      });
    },
    onError: () => {
      localStorage.removeItem("token");
      history.push("/login");
    },
    staleTime: 50000,
  });

  const resultsQuery = useQuery<RecoResults[]>(
    "results",
    () => getRecommendations(token!, seedOptions, options),
    {
      enabled: false,
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
          <Fade
            style={{ width: "100%", gridColumnStart: 1, gridColumnEnd: -1 }}
            triggerOnce={true}
            direction="up"
            cascade={true}
          >
            <h1 className="option-tiles-header">Recommendations</h1>
          </Fade>
          {optionArray.sort().map((x, index) => (
            <OptionTile
              name={x[0]}
              options={x[1]}
              index={index}
              setCurrent={setCurrent}
              openModal={openModal}
              key={x[0]}
            />
          ))}
          <Fade
            style={{ width: "100%", gridColumnStart: 1, gridColumnEnd: -1 }}
            triggerOnce={true}
            direction="up"
            cascade={true}
          >
            <Button
              onClick={() => {
                toast.promise(
                  resultsQuery.refetch(),
                  {
                    loading: "Loading",
                    success: (res) => {
                      return "Got it!";
                    },
                    error: (err) => `This just happened: ${err.toString()}`,
                  },
                  {}
                );
              }}
              //Disabled white fetching
              disabled={artistsQuery.isLoading || tracksQuery.isLoading}
            >
              Get Recommendations
            </Button>
          </Fade>

          {/* Show results view after fetching */}
          {resultsQuery.isSuccess ? (
            <Results results={resultsQuery.data} />
          ) : (
            ""
          )}
        </div>

        <Modal
          shouldCloseOnOverlayClick={true}
          isOpen={isModalOpen}
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
            max={name === "tempo" ? 200 : 100}
            marks={
              name === "tempo"
                ? {
                    0: <span>0</span>,
                    100: <span>100</span>,
                    200: <span>200</span>,
                  }
                : {
                    0: <span>0</span>,
                    100: <span>100</span>,
                  }
            }
            value={[min, target, max]}
            allowCross={false}
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
            pushable={1}
          />
          <NumberInput
            isAuto={isAuto}
            value={min}
            target={target}
            label="Min:"
            name="min"
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, min: Number(e.target.value) };
              });
            }}
            type="number"
          />
          <NumberInput
            isAuto={isAuto}
            value={target}
            label="Target:"
            name="target"
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, target: Number(e.target.value) };
              });
            }}
            type="number"
          />
          <NumberInput
            isAuto={isAuto}
            value={max}
            target={target}
            max={name === "tempo" ? 300 : 0}
            label="Max:"
            name="max"
            onChange={(e) => {
              setCurrentOption((prev) => {
                return { ...prev, max: Number(e.target.value) };
              });
            }}
            type="number"
          />
          <Button
            style={{
              userSelect: "none",
              border: "none",
              borderRadius: "24px",
              color: isAuto ? "#eee" : "#444",
              backgroundColor: buttonBg,
              outline: "none",
              transition: "all .3s ease-in",
              padding: "0",
              fontSize: "1.2em",
            }}
            onClick={() => {
              setCurrentOption((prev) => {
                return { ...prev, isAuto: !prev.isAuto };
              });
            }}
          >
            <span style={{ userSelect: "none" }}>Auto</span>
          </Button>
        </Modal>
      </Wrapper>
    </>
  );

  function closeModal() {
    setIsModalOpen(false);
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
