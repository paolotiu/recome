import { scaleLinear } from "d3-scale";
import * as d3 from "d3";
export function multiply100(num: number) {
  return Math.round(num * 100);
}

export function convertToPositiveRange(x: number) {
  const scale = scaleLinear().domain([-60, 0]).rangeRound([0, 100]);
  return scale(x);
}

export function responsivefy(
  svg: d3.Selection<any, any, any, any>,
  ...args: any[]
) {
  // get container + svg aspect ratio
  const container = d3.select(svg.node()?.parentNode as any),
    width = parseInt(svg.style("width")),
    height = parseInt(svg.style("height"));

  let aspect = width / height;
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
  d3.select(window).on("resize." + container.attr("id"), () => {
    resize();
  });

  // get width of container and resize svg to fit it
  function resize() {
    if (!svg.style("width")) {
      d3.select(window).on("resize." + container.attr("id"), () => {
        return null;
      });
      return;
    }

    var targetWidth = parseInt(container.style("width"));
    svg.attr("width", targetWidth);
    svg.attr("height", Math.round(targetWidth / aspect));
  }
}

export function toObjArray(obj: { [key: string]: number }) {
  const arr = [];
  for (const [key, value] of Object.entries(obj)) {
    arr.push({ key, value });
  }
  return arr;
}
export function getTopFive(arr: { key: string; value: number }[]) {
  //sorting to top 3 function
  arr.sort(function (a, b) {
    return b.value - a.value;
  });
  return arr.slice(0, 5);
}
export function getKeyByValue(
  object: { [key: string]: string },
  value: string
) {
  return Object.keys(object).find((key) => object[key] === value);
}

export function logOut() {
  localStorage.removeItem("token");
  window.location.assign(window.location.hostname);
}
