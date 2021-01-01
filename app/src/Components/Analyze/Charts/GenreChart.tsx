import * as d3 from "d3";
import countBy from "lodash.countby";
import React, { useEffect, useRef } from "react";
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
  uid?: string;
  id?: string;
}

export const GenreChart: React.FC<Props> = ({
  artistIDs,
  className,
  uid,
  id,
}) => {
  const token = localStorage.getItem("token")!;
  const { data: genres, isLoading } = useQuery(
    "artistsGenres",
    () => getGenresofArtists(token, artistIDs),
    {
      enabled: !!artistIDs.length,
      staleTime: Infinity,
    }
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (genres && containerRef.current) {
      const counted = countBy<string[]>(genres);
      const genreArray = toObjArray(counted);
      const top5 = getTopFive(genreArray);

      renderChart(top5, containerRef.current);
      let windowWidth = window.innerWidth;
      const render = () => {
        if (window.innerWidth !== windowWidth && containerRef.current) {
          windowWidth = window.innerWidth;
          renderChart(top5, containerRef.current);
        }
      };
      window.addEventListener("resize", render);

      return () => window.removeEventListener("resize", render);
    }
  }, [genres]);

  if (isLoading) {
    return <div style={{ height: "500px", width: "80vw" }}></div>;
  }

  return (
    <StyledChart
      id={uid ? (id ? uid + id : uid) : id}
      className={className}
      ref={containerRef}
    >
      <div style={{ height: "500px", width: "80vw" }} id="placeholder"></div>
    </StyledChart>
  );
};

function renderChart(
  data: { key: string; value: number }[],
  container: HTMLDivElement
) {
  const margin = { top: 10, bottom: 40, left: 80, right: 60 };
  //Delete previous chart when rerender
  d3.select(container).selectAll("svg").remove();
  d3.select(container).select("#placeholder").remove();
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

  const animTime = 2000;
  const ease = d3.easeSinIn;
  const svg = d3
    .select(container)
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
