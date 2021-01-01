import * as d3 from "d3";
import { v4 as uuid } from "uuid";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import arrowDown from "../../../static/arrowDown.png";
import {
  getAllCountryFeatures,
  getCountryFeatures,
  getGlobalFeatures,
  getUserFeatures,
} from "../../../functions/api";
import { responsivefy, getKeyByValue } from "../../../functions/util";
import { IUser } from "../../../types";
import { useUser } from "../../../UserContext";
import { COUNTRIES, COUNTRY_TO_CODE } from "./data";
import { toast } from "react-hot-toast";
const StyledChart = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  ul {
    display: flex;
    list-style-type: none;
    justify-content: space-evenly;
    li {
      white-space: nowrap;

      :last-child {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      margin: 0 0.5em;
      .bullet {
        margin-right: 10px;
        display: inline-block;
        width: 30px;
        @media (max-width: 550px) {
          width: 10px;
        }
        height: 10px;
      }
    }
  }
  svg {
    align-self: center;
    max-width: clamp(100px, 90vw, 800px);

    .bar {
      fill: ${(props) => props.theme.secondary};
    }

    .tick {
      font-family: Poppins;
      font-size: 0.5em;
      fill: gray;
    }

    .domain {
      display: none;
    }
    .label {
      font-weight: 300;
      font-size: 0.5em;
      fill: ${(props) => props.theme.light};
    }
  }
  select {
    appearance: none;
    display: grid;
    align-self: center;
    width: clamp(200px, 50%, 300px);
    padding: 0;
    height: fit-content;
    background-color: transparent;
    border: none;
    color: ${(props) => props.theme.light};
    font-weight: bold;
    font-size: 1.2em;
    padding-right: 29px;
    background: url(${arrowDown}) no-repeat right;

    :after {
      content: " sadad";
      width: 0.8em;
      height: 0.5em;
      background-color: black;
      clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    }
    option {
      font-family: Poppins;
      color: ${(props) => props.theme.darkBg};
    }
  }
`;
interface Props {
  className?: string;
  uid?: string;
  id?: string;
}

interface FeaturesState {
  [key: string]: Features;
}

interface Features {
  _id: string;
  acousticness: number;
  danceability: number;
  tempo: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
}

export const MoodChart: React.FC<Props> = ({ className, uid, id }) => {
  const user = useUser() as IUser;
  const sessionFeatures = sessionStorage.getItem("features");
  const [features, setFeatures] = useState<FeaturesState>(
    typeof sessionFeatures === "string" ? JSON.parse(sessionFeatures) : ""
  );

  const [currentCountry, setCurrentCountry] = useState(
    sessionStorage.getItem("country") || user.country
  );
  const [listColors, setListColors] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { refetch: refetchCountry } = useQuery(
    "countryFeatures",
    () => getAllCountryFeatures(),
    {
      onSuccess: (d: Features[]) => {
        if (d) {
          setFeatures((prev) => {
            let temp: { [key: string]: Features } = {};
            d.forEach((x) => {
              temp[x._id] = x;
            });
            if (prev) {
              temp = { ...prev, ...temp };

              return temp;
            } else {
              return temp;
            }
          });
        }
      },

      staleTime: Infinity,
      retry: 10,
      retryDelay: 1,
    }
  );

  useQuery("userFeatures", () => getUserFeatures(user.id), {
    onSuccess: (d) => {
      if (d) {
        setFeatures((prev) => {
          if (prev) {
            return { ...prev, user: d };
          } else {
            return { user: d };
          }
        });
      }
    },
    staleTime: Infinity,
  });

  useQuery("globalFeatures", () => getGlobalFeatures(), {
    onSuccess: (d) => {
      if (d) {
        setFeatures((prev) => {
          if (prev) {
            return { ...prev, global: d[0] };
          } else {
            return { global: d[0] };
          }
        });
      }
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const container = containerRef.current;
    const chart = Chart(["happiness", "danceability", "acousticness"]);

    if (container && features) {
      chart.render(container);
      setListColors(chart.colors);
      const addData = () => {
        chart.addData({
          happiness: features.user.valence * 100,
          acousticness: features.user.acousticness * 100,
          danceability: features.user.danceability * 100,
        });
        chart.addData({
          happiness: features.global?.valence * 100,
          acousticness: features.global?.acousticness * 100,
          danceability: features.global?.danceability * 100,
        });
        if (features[currentCountry]) {
          chart.addData({
            happiness: features[currentCountry]?.valence * 100,
            acousticness: features[currentCountry]?.acousticness * 100,
            danceability: features[currentCountry]?.danceability * 100,
          });
        } else {
          refetchCountry();
        }
      };
      if (features.user && features.global) {
        addData();
      }
      let windowWidth = window.innerWidth;
      const render = () => {
        if (window.innerWidth !== windowWidth && container) {
          windowWidth = window.innerWidth;
          chart.render(container);
          addData();
        }
      };
      window.addEventListener("resize", render);

      return () => window.removeEventListener("resize", render);
    }
  }, [features, currentCountry, refetchCountry]);
  useEffect(() => {
    return () => {
      // Remember on unmount
      sessionStorage.setItem("features", JSON.stringify(features));
      sessionStorage.setItem("country", currentCountry);
    };
  }, [features, currentCountry]);
  return (
    <StyledChart
      id={uid ? (id ? uid + id : uid) : id}
      className={className}
      ref={containerRef}
    >
      <ul>
        {listColors.map((x, i) => {
          return (
            <li key={uuid()}>
              <span className="bullet" style={{ backgroundColor: x }} />
              <span>
                {i === 0
                  ? "You"
                  : i === 1
                  ? "Global"
                  : getKeyByValue(COUNTRY_TO_CODE, currentCountry)}
              </span>
            </li>
          );
        })}
      </ul>
      <select
        value={currentCountry}
        onChange={(e) => {
          setCurrentCountry(e.target.value);
        }}
      >
        {COUNTRIES.map((x) => (
          <option key={uuid()} value={COUNTRY_TO_CODE[x]}>
            {" "}
            {x}
          </option>
        ))}
      </select>
    </StyledChart>
  );
};

////////////////////////////
// CHART FACTORY FUNCTION///
////////////////////////////

function Chart(features: string[]) {
  type Data = {
    happiness: number;
    acousticness: number;
    danceability: number;
    [key: string]: number;
  };
  const margin = { top: 30, bottom: 0, left: 0, right: 0 };
  let width = 400 - margin.right - margin.left;
  let height = 250 - margin.top - margin.bottom;
  let ticks = [20, 40, 60, 80, 100];
  let colors = ["orange", "blue", "green"];
  let count = 0;
  let baseSvg: d3.Selection<SVGGElement, any, any, any>;

  const radialScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, width / 4]);

  const render = (container: HTMLDivElement) => {
    //Delete previous chart when rerender
    d3.select(container).selectAll("svg").remove();

    // For responsiveness
    if (window.matchMedia("(max-width: 525px)").matches) {
      margin.left = -30;
      margin.right = 30;
      height = 300 - margin.top - margin.bottom;
    } else if (window.matchMedia("(max-width: 780px)").matches) {
      margin.left = 0;
      margin.right = 0;
      height = 300 - margin.top - margin.bottom;
    } else {
      // height = 300 - margin.top - margin.bottom;
    }

    count = 0;
    const svg = d3
      .select(container)
      .insert("svg", "select")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(responsivefy)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    baseSvg = svg;
    ticks.forEach((t) =>
      svg
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
    );

    ticks.forEach((t) =>
      svg
        .append("text")
        .attr("class", "tick")
        .attr("x", width / 2)
        .attr("y", height / 2 - radialScale(t) - 2)
        .text(t.toString())
    );

    for (let i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;

      let line_coordinate = angleToCoordinate(angle, 100);
      let label_coordinate = angleToCoordinate(angle, 120);

      //draw axis line
      svg
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", line_coordinate[0])
        .attr("y2", line_coordinate[1])
        .attr("stroke", "lightgray");

      //draw axis label
      const center = angleToCoordinate(Math.PI / 2, 120)[0];
      svg
        .append("text")
        .attr("class", "label")
        .attr("x", label_coordinate[0])
        .attr("y", label_coordinate[1])
        .attr(
          "text-anchor",
          label_coordinate[0] < center
            ? "end"
            : label_coordinate[0] === center
            ? "middle"
            : ""
        )
        .text(ft_name);
    }
  };

  const addData = (data: Data) => {
    let color = colors[count];
    let coordinates = getPathCoordinates(data);

    // Dont add if baseSvg not set
    if (!baseSvg) {
      return;
    }
    const svg = baseSvg;
    const path = svg
      .append("path")
      .datum(coordinates)
      .attr("d", (d) => d3.line()(d))
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.4);

    const dot = svg
      .selectAll(".dot-" + count)
      .data(coordinates)
      .enter()
      .append("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", 2)
      .attr("fill", color)
      .attr("opacity", 0.78);

    count++;
    const remove = () => {
      path.remove();
      dot.remove();
    };

    return remove;
  };

  function getPathCoordinates(data_point: Data) {
    let coordinates = [];
    for (var i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }

  function angleToCoordinate(angle: number, value: number): [number, number] {
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return [width / 2 + x, height / 2 - y];
  }

  return {
    render,
    addData,
    colors,
  };
}

// function renderChart(
//   data: {
//     [key: string]: number;
//     happiness: number;
//     accousticness: number;
//     danceability: number;
//   }[],
//   container: HTMLDivElement
// ) {
//   const features = ["happiness", "danceability", "accousticness"];

//   const margin = { top: 10, bottom: 40, left: 80, right: 60 };
//   //Delete previous chart when rerender
//   d3.select(container).selectAll("svg").remove();

//   // For responsiveness
//   let width = 500 - margin.right - margin.left;
//   let height = 300 - margin.top - margin.bottom;
//   //   if (window.matchMedia("(max-width: 525px)").matches) {
//   //     height = 700 - margin.top - margin.bottom;
//   //   } else if (window.matchMedia("(max-width: 780px)").matches) {
//   //     height = 400 - margin.top - margin.bottom;
//   //   } else {
//   //     height = 300 - margin.top - margin.bottom;
//   //   }
//   //   const svg = d3
//   //   .select(container)
//   //   .append("svg")
//   //   .attr("width", width + margin.left + margin.right)
//   //   .attr("height", height + margin.top + margin.bottom)
//   //   .call(responsivefy)
//   //   .append("g")
//   //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   const svg = d3
//     .select(container)
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .call(responsivefy)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   const radialScale = d3
//     .scaleLinear()
//     .domain([0, 100])
//     .range([0, width / 4]);
//   let ticks = [20, 40, 60, 80, 100];
//   ticks.forEach((t) =>
//     svg
//       .append("circle")
//       .attr("cx", width / 2)
//       .attr("cy", height / 2)
//       .attr("fill", "none")
//       .attr("stroke", "gray")
//       .attr("r", radialScale(t))
//   );

//   ticks.forEach((t) =>
//     svg
//       .append("text")

//       .attr("class", "tick")
//       .attr("x", width / 2)
//       .attr("y", height / 2 - radialScale(t))
//       .text(t.toString())
//   );
//   for (let i = 0; i < features.length; i++) {
//     let ft_name = features[i];
//     let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
//     let line_coordinate = angleToCoordinate(angle, 100);
//     let label_coordinate = angleToCoordinate(angle, 110);

//     //draw axis line
//     svg
//       .append("line")
//       .attr("x1", width / 2)
//       .attr("y1", height / 2)
//       .attr("x2", line_coordinate[0])
//       .attr("y2", line_coordinate[1])
//       .attr("stroke", "black");

//     //draw axis label

//     svg
//       .append("text")
//       .attr("class", "label")
//       .attr("x", label_coordinate[0])
//       .attr("y", label_coordinate[1])
//       .attr(
//         "text-anchor",
//         label_coordinate[0] < 180
//           ? "end"
//           : label_coordinate[1] === 180
//           ? "middle"
//           : ""
//       )
//       .text(ft_name);
//   }

//   let colors = ["darkorange", "gray", "navy"];
//   for (var i = 0; i < data.length; i++) {
//     let d = data[i];
//     let color = colors[i];
//     let coordinates = getPathCoordinates(d);
//     console.log(coordinates);
//     //draw the path element
//     svg
//       .append("path")
//       .datum(coordinates)
//       .attr("d", (d) => d3.line()(d))
//       .attr("stroke-width", 3)
//       .attr("stroke", color)
//       .attr("fill", color)
//       .attr("stroke-opacity", 1)
//       .attr("opacity", 0.5);
//   }
//   function getPathCoordinates(data_point: {
//     [key: string]: number;
//     happiness: number;
//     accousticness: number;
//     danceability: number;
//   }) {
//     let coordinates = [];
//     for (var i = 0; i < features.length; i++) {
//       let ft_name = features[i];
//       let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
//       coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
//     }
//     return coordinates;
//   }
//   function angleToCoordinate(angle: number, value: number): [number, number] {
//     let x = Math.cos(angle) * radialScale(value);
//     let y = Math.sin(angle) * radialScale(value);
//     return [width / 2 + x, height / 2 - y];
//   }
// }
