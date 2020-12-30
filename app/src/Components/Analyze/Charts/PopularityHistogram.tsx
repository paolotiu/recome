import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import * as d3 from "d3";
import { responsivefy } from "../../../functions/util";
const StyledChart = styled.div`
  width: 100%;
  position: relative;

  svg {
    .bar {
      fill: #69b3a2;
    }
    .on {
      fill: ${(props) => props.theme.primary};
    }

    /*     
    .yAxis,
    .xAxis {
      text {
        font-size: 1.8em;
      }
    } */
  }
`;
interface Props {
  popularityNums: number[];
  uid?: string;
}

export const PopularityHistogram: React.FC<Props> = ({
  popularityNums,
  uid,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      const nonZeroPops = popularityNums.filter((x) => x);
      renderChart(nonZeroPops, containerRef.current);
      let windowWidth = window.innerWidth;
      const render = () => {
        if (window.innerWidth !== windowWidth && containerRef.current) {
          windowWidth = window.innerWidth;
          renderChart(nonZeroPops, containerRef.current);
        }
      };
      render();
      window.addEventListener("resize", render);

      return () => window.removeEventListener("resize", render);
    }
  }, [popularityNums]);

  return <StyledChart ref={containerRef} className="pop-chart" />;
};

function renderChart(data: number[], container: HTMLDivElement) {
  //Delete previous chart when rerender
  d3.select(container).selectAll("*").remove();

  const margin = { top: 10, bottom: 40, left: 20, right: 10 };

  // For responsiveness
  let width = 600 - margin.right - margin.left;
  let height = 400 - margin.top - margin.bottom;
  if (window.matchMedia("(max-width: 525px)").matches) {
    height = 300 - margin.top - margin.bottom;
  } else if (window.matchMedia("(max-width: 780px)").matches) {
    height = 300 - margin.top - margin.bottom;
  } else {
    height = 300 - margin.top - margin.bottom;
  }

  const svg = d3
    .select(container)
    .append("svg")
    .attr("class", "pop")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3.scaleLinear().domain([1, 100]).range([0, width]);

  //Append x axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "xAxis")
    .call(d3.axisBottom(xScale));

  const histogram = d3
    .bin()
    .value((d) => d)
    .domain(xScale.domain() as [number, number])
    .thresholds(99);

  const bins: d3.Bin<number, number>[] = histogram(data);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins.map((bin) => bin.length)) as number])
    .range([height, 0]);
  //Append y axis
  svg.append("g").attr("class", "yAxis").call(d3.axisLeft(yScale));

  // Tooltip setup
  const tooltip = d3
    .select(container)
    .append("span")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("position", "absolute")
    .style("top", "0px")
    .style("right", "0px");

  //Append bars
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 1)
    .attr("transform", function (d) {
      return (
        "translate(" + xScale(d.x0 as number) + "," + yScale(d.length) + ")"
      );
    })
    .attr("width", function (d) {
      return xScale(d.x1 as number) - xScale(d.x0 as number) - 1;
    })
    .attr("height", function (d) {
      return height - yScale(d.length);
    })
    .on("touchstart mouseenter", function (e, d) {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.type === "touchstart") {
        const touch = e.changedTouches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        document.querySelectorAll(".pop .bar").forEach((x) => {
          if (x !== elem) {
            x.classList.remove("on");
          }
        });
        if (elem?.tagName === "rect") {
          elem.classList.add("on");
        }
        showTooltip(e, d);
      } else {
        showTooltip(e, d);
        this.classList.add("on");
      }
    })
    .on("touchmove mousemove", function (e, d) {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.type === "touchmove") {
        const touch = e.changedTouches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem) {
          const data = d3.select(elem).data()[0] as d3.Bin<number, number>;
          if (data && Array.isArray(data)) {
            showRange(e, data);
          }
        }
        document.querySelectorAll(".pop .bar").forEach((x) => {
          if (x !== elem) {
            x.classList.remove("on");
          }
        });
        if (elem?.tagName === "rect") {
          elem.classList.add("on");
        }
      } else {
        showRange(e, d);
      }
    })
    .on("touchend mouseout", function (e, d) {
      e.preventDefault();
      if (e.type === "touchend") {
        document.querySelectorAll(".pop .bar").forEach((x) => {
          x.classList.remove("on");
        });
      }
      this.classList.remove("on");
      hideTooltip();
    });

  // .on("touchmove", function (e: MouseEvent, d) {
  //   e.preventDefault();
  //   console.log(d);
  // });

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)

  function showTooltip(e: MouseEvent, d: d3.Bin<number, number>) {
    tooltip.transition().duration(100).style("opacity", 1);
    showRange(e, d);
  }

  function showRange(e: MouseEvent, d: d3.Bin<number, number>) {
    tooltip.html(`${d.x0}`);
  }
  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  function hideTooltip() {
    tooltip.transition().duration(100).style("opacity", 0);
  }
}
