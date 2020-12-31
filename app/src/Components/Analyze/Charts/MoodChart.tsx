import * as d3 from "d3";
import countBy from "lodash.countby";
import React, { useEffect, useRef } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { getCountryFeatures, getGenresofArtists } from "../../../functions/api";
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
        if (!d) {
          countryFeaturesQuery.refetch();
        }
      },
    }
  );
  useEffect(() => {}, []);

  return (
    <StyledChart
      id={uid ? (id ? uid + id : uid) : id}
      className={className}
      ref={containerRef}
    ></StyledChart>
  );
};

// function renderChart(
//   data: { key: string; value: number }[],
//   container: HTMLDivElement
// ) {}
