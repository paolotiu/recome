import * as d3 from "d3";
import countBy from "lodash.countby";
import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getCountryFeatures,
  getGenresofArtists,
  getUserFeatures,
} from "../../../functions/api";
import { toObjArray, getTopFive, responsivefy } from "../../../functions/util";
import { IUser } from "../../../types";
import { useUser } from "../../../UserContext";

const StyledChart = styled.div`
  max-width: clamp(100px, 90vw, 1000px);
  width: 100%;
  svg {
    .bar {
      fill: ${(props) => props.theme.secondary};
    }

    .tick {
      font-family: Poppins;
      font-size: 0.5em;
    }

    .domain {
      display: none;
    }
    .label {
      font-weight: thin;
      font-size: 0.5em;
      fill: ${(props) => props.theme.light};
    }
  }
`;
interface Props {
  className?: string;
  uid?: string;
  id?: string;
}

export const MoodChart: React.FC<Props> = ({ className, uid, id }) => {
  const token = localStorage.getItem("token")!;
  const user = useUser() as IUser;
  const containerRef = useRef<HTMLDivElement>(null);
  const countryFeaturesQuery = useQuery(
    "countryFeatures",
    () => getCountryFeatures(user.country || "GB"),
    {
      onSuccess: (d) => {
        // if (!d) {
        //   countryFeaturesQuery.refetch();
        // }
      },
      staleTime: Infinity,
    }
  );

  const userFeaturesQuery = useQuery(
    "userFeatures",
    () => getUserFeatures(user.id),
    {
      staleTime: Infinity,
    }
  );
  useEffect(() => {
    const container = containerRef.current;
    const chart = Chart(["happiness", "danceability", "accousticness"]);
    if (container) {
      chart.render(container);
      chart.addData({ happiness: 10, accousticness: 20, danceability: 90 });
      chart.addData({ happiness: 40, accousticness: 80, danceability: 40 });
    }
  }, []);

  return (
    <StyledChart
      id={uid ? (id ? uid + id : uid) : id}
      className={className}
      ref={containerRef}
    ></StyledChart>
  );
};

function renderChart(
  data: {
    [key: string]: number;
    happiness: number;
    accousticness: number;
    danceability: number;
  }[],
  container: HTMLDivElement
) {
  const features = ["happiness", "danceability", "accousticness"];

  const margin = { top: 10, bottom: 40, left: 80, right: 60 };
  //Delete previous chart when rerender
  d3.select(container).selectAll("svg").remove();

  // For responsiveness
  let width = 500 - margin.right - margin.left;
  let height = 300 - margin.top - margin.bottom;
  //   if (window.matchMedia("(max-width: 525px)").matches) {
  //     height = 700 - margin.top - margin.bottom;
  //   } else if (window.matchMedia("(max-width: 780px)").matches) {
  //     height = 400 - margin.top - margin.bottom;
  //   } else {
  //     height = 300 - margin.top - margin.bottom;
  //   }
  //   const svg = d3
  //   .select(container)
  //   .append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .call(responsivefy)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const radialScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, width / 4]);
  let ticks = [20, 40, 60, 80, 100];
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
      .attr("y", height / 2 - radialScale(t))
      .text(t.toString())
  );
  for (let i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
    let line_coordinate = angleToCoordinate(angle, 100);
    let label_coordinate = angleToCoordinate(angle, 110);

    //draw axis line
    svg
      .append("line")
      .attr("x1", width / 2)
      .attr("y1", height / 2)
      .attr("x2", line_coordinate[0])
      .attr("y2", line_coordinate[1])
      .attr("stroke", "black");

    //draw axis label

    svg
      .append("text")
      .attr("class", "label")
      .attr("x", label_coordinate[0])
      .attr("y", label_coordinate[1])
      .attr(
        "text-anchor",
        label_coordinate[0] < 180
          ? "end"
          : label_coordinate[1] === 180
          ? "middle"
          : ""
      )
      .text(ft_name);
  }

  let colors = ["darkorange", "gray", "navy"];
  for (var i = 0; i < data.length; i++) {
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);
    console.log(coordinates);
    //draw the path element
    svg
      .append("path")
      .datum(coordinates)
      .attr("d", (d) => d3.line()(d))
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
  }
  function getPathCoordinates(data_point: {
    [key: string]: number;
    happiness: number;
    accousticness: number;
    danceability: number;
  }) {
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
}

function Chart(features: string[]) {
  const margin = { top: 10, bottom: 40, left: 80, right: 60 };
  let width = 500 - margin.right - margin.left;
  let height = 300 - margin.top - margin.bottom;
  let ticks = [20, 40, 60, 80, 100];
  let colors = ["darkorange", "gray", "navy"];
  let count = 0;
  let baseSvg: d3.Selection<SVGGElement, any, any, any>;
  const radialScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, width / 4]);

  const render = (container: HTMLDivElement) => {
    //Delete previous chart when rerender
    d3.select(container).selectAll("svg").remove();

    const svg = d3
      .select(container)
      .append("svg")
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
        .attr("y", height / 2 - radialScale(t))
        .text(t.toString())
    );

    for (let i = 0; i < features.length; i++) {
      let ft_name = features[i];
      let angle = Math.PI / 2 + (2 * Math.PI * i) / features.length;
      let line_coordinate = angleToCoordinate(angle, 100);
      let label_coordinate = angleToCoordinate(angle, 110);

      //draw axis line
      svg
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", line_coordinate[0])
        .attr("y2", line_coordinate[1])
        .attr("stroke", "black");

      //draw axis label

      svg
        .append("text")
        .attr("class", "label")
        .attr("x", label_coordinate[0])
        .attr("y", label_coordinate[1])
        .attr(
          "text-anchor",
          label_coordinate[0] < 180
            ? "end"
            : label_coordinate[1] === 180
            ? "middle"
            : ""
        )
        .text(ft_name);
    }
  };

  const addData = (data: {
    happiness: number;
    accousticness: number;
    danceability: number;
  }) => {
    let color = colors[count];
    let coordinates = getPathCoordinates(data);

    // Dont add if baseSvg not set
    if (!baseSvg) {
      return;
    }
    const svg = baseSvg;
    svg
      .append("path")
      .datum(coordinates)
      .attr("d", (d) => d3.line()(d))
      .attr("stroke-width", 3)
      .attr("stroke", color)
      .attr("fill", color)
      .attr("stroke-opacity", 1)
      .attr("opacity", 0.5);
    count++;
  };

  function getPathCoordinates(data_point: {
    [key: string]: number;
    happiness: number;
    accousticness: number;
    danceability: number;
  }) {
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
  };
}
