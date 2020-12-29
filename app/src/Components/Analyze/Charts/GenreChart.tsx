import * as d3 from "d3";
import countBy from "lodash.countby";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getGenresofArtists } from "../../../functions/api";
import { toObjArray, getTopFive, responsivefy } from "../../../functions/util";

const StyledChart = styled.div`
  max-width: clamp(100px, 90vw, 1000px);
  width: 100%;
  svg {
    .bar {
      fill: ${(props) => props.theme.secondary};
    }
    .axisLeft {
      .tick {
        font-family: Poppins;
        font-size: 1.2em;
      }
    }
    .domain {
      display: none;
    }
    .label {
      font-weight: bold;
      fill: ${(props) => props.theme.light};
    }
  }
`;
interface Props {
  artistIDs: string[];
  className?: string;
}

export const GenreChart: React.FC<Props> = ({ artistIDs, className }) => {
  const token = localStorage.getItem("token")!;
  const { data: genres, isLoading } = useQuery(
    "artistsGenres",
    () => getGenresofArtists(token, artistIDs),
    {
      enabled: !!artistIDs.length,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (genres) {
      const counted = countBy<string[]>(genres);
      const genreArray = toObjArray(counted);
      const top5 = getTopFive(genreArray);
      console.log("rendering");
      renderChart(top5);
      let windowWidth = window.innerWidth;
      const render = () => {
        if (window.innerWidth != windowWidth) {
          windowWidth = window.innerWidth;
          renderChart(top5);
        }
      };
      window.addEventListener("resize", render);

      return () => window.removeEventListener("resize", render);
    }
  }, [genres]);

  if (isLoading) {
    return <div style={{ height: "500px", width: "80vw" }}></div>;
  }

  return <StyledChart id="genreChart" className={className}></StyledChart>;
};

function renderChart(data: { key: string; value: number }[]) {
  const margin = { top: 10, bottom: 40, left: 80, right: 60 };

  // For responsiveness
  let width = 500 - margin.right - margin.left;
  let height = 300 - margin.top - margin.bottom;
  if (window.matchMedia("(max-width: 525px)").matches) {
    height = 700 - margin.top - margin.bottom;
  } else if (window.matchMedia("(max-width: 780px)").matches) {
    height = 400 - margin.top - margin.bottom;
  } else {
    height = 300 - margin.top - margin.bottom;
  }
  // If device is small then change height

  const animTime = 2000;
  const ease = d3.easeSinIn;
  d3.select("#genreChart").selectAll("svg").remove();
  const svg = d3
    .select("#genreChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((x) => x.value))!])
    .range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((x) => x.key))
    .range([0, height])
    .padding(0.2);

  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .attr("class", "axisLeft")
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("height", yScale.bandwidth())
    .attr("y", (data) => yScale(data.key) as number)
    .transition()
    .duration(animTime)
    .ease(ease)
    .attr("class", "bar")
    .attr("x", 1)
    .attr("width", (data) => xScale(data.value));

  svg
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("text-anchor", "start")
    .text(0)
    .attr(
      "y",
      (data) => (yScale(data.key) as number) + yScale.bandwidth() / 2 + 6
    )
    .attr("x", 10);
  svg
    .selectAll(".label")
    .data(data)
    .transition()
    .duration(animTime)
    .ease(ease)
    .attr("x", (d) => xScale(d.value) + 10)
    .textTween((d) => (t) => {
      const i = d3.interpolate(0, d.value);
      return `${i(t).toFixed(0)}`;
    });
}
