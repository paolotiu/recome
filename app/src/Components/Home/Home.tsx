import React, { useEffect } from "react";
import { Redirect } from "react-router";
import styled from "styled-components";
import { ReactComponent as Glass } from "../../static/glass.svg";
import { CenterGrid } from "../index";
import { HomeTile } from "./HomeTile/HomeTile";
import { ReactComponent as Heart } from "../../static/heart.svg";
import { ReactComponent as Gears } from "../../static/gears.svg";
import { ReactComponent as Chart } from "../../static/chart.svg";
import { v4 as uuid } from "uuid";
import {
  // getAllSavedTracks,
  getTopArtists,
  getTopTracks,
} from "../../functions/api";
import { useQueryClient } from "react-query";
import ReactGA from "react-ga";
const time_ranges: ["short_term", "medium_term", "long_term"] = [
  "short_term",
  "medium_term",
  "long_term",
];
const Wrapper = styled(CenterGrid)`
  .hometiles-container {
    display: grid;
    padding: 1em;
    gap: 1em;
    grid-template-columns: repeat(3, 1fr);

    justify-items: center;
  }
  & > a {
    animation: none;
    margin: 0.4em;
  }

  @media (max-width: 768px) {
    .hometiles-container {
      display: flex;
      flex-direction: column;
      gap: 0;

      a {
        margin: 0.5em;
        animation: bottom-in 0.4s ease-in;
      }
    }
  }

  @media (min-width: 768px) {
    a[id="hometile-1"] {
      animation: top-left-in 0.4s ease-in;
    }

    a[id="hometile-2"] {
      animation: top-in 0.4s ease-in;
    }
    a[id="hometile-3"] {
      animation: top-right-in 0.4s ease-in;
    }

    a[id="hometile-4"] {
      animation: bottom-left-in 0.4s ease-in;
    }

    a[id="hometile-5"] {
      animation: bottom-in 0.4s ease-in;
    }

    a[id="hometile-6"] {
      animation: bottom-right-in 0.4s ease-in;
    }
  }
`;

export const Home: React.FC = () => {
  const token = localStorage.getItem("token")!;
  const queryClient = useQueryClient();
  useEffect(() => {
    ReactGA.pageview("/home");
  }, []);
  const prefetchTop = async () => {
    // queryClient.prefetchQuery("allTracks", () => getAllSavedTracks(token), {
    //   staleTime: Infinity,
    // });
    time_ranges.forEach((range) => {
      queryClient.prefetchQuery(
        ["tracks", range],
        () => getTopTracks(token, 50, 0, range),
        {
          staleTime: Infinity,
        }
      );

      queryClient.prefetchQuery(
        ["tracks", 49, range],
        () => getTopTracks(token, 50, 49, range),
        {
          staleTime: Infinity,
        }
      );

      queryClient.prefetchQuery(
        ["artists", range],
        () => getTopArtists(token, 50, 0, range),
        {
          staleTime: Infinity,
        }
      );

      queryClient.prefetchQuery(
        ["artists", 49, range],
        () => getTopArtists(token, 50, 49),
        {
          staleTime: Infinity,
        }
      );
    });
  };
  prefetchTop();

  if (!token) {
    return <Redirect to="/login" />;
  }
  return (
    <Wrapper>
      <div className="hometiles-container">
        <HomeTile
          header="Recommend"
          desc="Get recommandations based on metrics tuned to your liking. "
          icon={() => <Glass />}
          path="/recommend"
          key={uuid()}
          id={"hometile-" + 1}
        />
        <HomeTile
          header="Favorites"
          desc="See your top tracks and artists from  different time ranges. "
          icon={() => <Heart id="heart" />}
          path="/favorites"
          key={uuid()}
          id={"hometile-" + 2}
        />
        <HomeTile
          header="Generate"
          desc="Generate a photo of your top tracks and artists."
          icon={() => <Gears id="gears" />}
          path="/generate"
          key={uuid()}
          id={"hometile-" + 3}
        />
        <HomeTile
          header="Analyze"
          desc="Look at charts and graphs made from your saved songs."
          icon={() => <Chart id="chart" />}
          path="/analyze"
          key={uuid()}
          id={"hometile-" + 4}
        />
      </div>
    </Wrapper>
  );
};
