import * as d3 from "d3";
import countBy from "lodash.countby";
import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import { getGenresofArtists } from "../../../functions/api";
import { toObjArray, getTopFive } from "../../../functions/util";

interface Props {
  artistIDs: string[];
}

export const GenreChart: React.FC<Props> = ({ artistIDs }) => {
  const token = localStorage.getItem("token")!;
  const { data: genres } = useQuery(
    "artistsGenres",
    () => getGenresofArtists(token, artistIDs),
    {
      enabled: !!artistIDs.length,
      staleTime: Infinity,
      onSuccess: (d) => {},
    }
  );

  useEffect(() => {
    if (genres) {
      const counted = countBy<string[]>(genres);
      const genreArray = toObjArray(counted);
      const top5 = getTopFive(genreArray);
      console.log("rendering");
      renderChart(top5);
    }
  }, [genres]);

  return <div id="genreChart" style={{ maxWidth: "600px" }}></div>;
};

function renderChart(data: { key: string; value: number }[]) {
  const margin = { top: 10, bottom: 40, left: 80, right: 10 },
    height = 300 - margin.top - margin.bottom,
    width = 500 - margin.right - margin.left;
  d3.select("#genreChart").selectAll("svg").remove();
  const svg = d3
    .select("#genreChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .attr("fill", "coral")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.map((x) => x.value))!])
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(" + 0 + "," + height + ")")
    .call(d3.axisBottom(xScale));
  const yScale = d3
    .scaleBand()
    .domain(data.map((x) => x.key))
    .range([0, height])
    .padding(0.1);

  svg
    .append("g")
    .call(d3.axisLeft(yScale))

    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (data) => yScale(data.key) as number)
    .attr("x", 1)
    .attr("width", (data) => xScale(data.value))
    .attr("height", yScale.bandwidth())
    .on("mouseover", (e, d) => {
      console.log(d);
    });
}

function responsivefy(
  svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
  ...args: any[]
) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node()?.parentNode as any),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height")),
    aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("perserveAspectRatio", "xMinYMid")
    .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}
