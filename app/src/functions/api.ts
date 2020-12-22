import toPairsIn from "lodash.topairsin";
import { SeedOptions, Options } from "./../types";
import axios from "axios";
import queryString from "query-string";

const url = "https://api.spotify.com/v1";

axios.defaults.baseURL = url;
export const getUser = async (token: string) => {
  const res = await axios.get(url + "/me", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// Get top 5 artists
export const getTopArtists = async (token: string) => {
  const res = await axios.get(url + "/me/top/artists?limit=0&offset=5", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// Get top 5 tracks
export const getTopTracks = async (token: string) => {
  const res = await axios.get(url + "/me/top/tracks?limit=5&offset=0", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

export const getGenreList = async (token: string) => {
  const res = await axios.get(url + "/recommendations/available-genre-seeds", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export const getRecommendations = async (
  token: string,
  seedOptions: SeedOptions,
  options: Options
) => {
  const stringifiedSeedOptions = stringifySeedOptions(seedOptions);
  const stringifiedOptions = queryString.stringify(cleanOptions(options));

  const res = await axios.get(
    url + "/recommendations?" + stringifiedSeedOptions + stringifiedOptions,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.tracks;
};

export const getTrackFeatures = async (token: string, ids: string[]) => {
  const joined = ids.join(",");

  const res = await axios.get(url + "/audio-features?ids=" + joined, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// Create Playlist then add songs
export const createPlaylist = async (
  token: string,
  id: string,
  name: string,
  desc: string,
  uris: string[]
) => {
  // const joined = uris.join(",");

  // const playlist = await axios.post(
  //   url + "/users/" + id + "/playlists",
  //   {
  //     name: name,
  //     description: desc,
  //     public: true,
  //   },
  //   {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // const res = await axios.post(
  //   url + "/playlists/" + playlist.data.id + "/tracks?uris=" + joined,
  //   {},
  //   {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // return playlist.data;
  return {
    name: "Recome Recommendations",
    id: "Stin",
    href: "JIewdjia",
    external_urls: {
      spotify: "JIwd",
    },
  };
};

function stringifySeedOptions(seedOptions: SeedOptions) {
  const arr = toPairsIn(seedOptions);
  let q = "";
  arr.forEach((seed: any) => {
    q += seed[0] + "=" + seed[1].join(",");
    q += "&";
  });
  return q;
}

function cleanOptions(options: Options) {
  const cleanedOptions: { [key: string]: number } = {};
  for (let key in options) {
    const currentOption = options[key];
    if (!currentOption.isAuto) {
      const name = currentOption.name;
      const min = "min_" + name;
      const target = "target_" + name;
      const max = "max_" + name;
      switch (currentOption.name) {
        case "loudness":
          // Conversion to -60 - 0
          const convert = (x: number) => {
            const oldr = 100;
            const newr = 0 - -60;
            const newval = ((x - 0) * newr) / oldr - 60;
            console.log(newval);
            return Math.floor(newval);
          };
          cleanedOptions[min] = convert(currentOption.min);
          cleanedOptions[max] = convert(currentOption.max);
          cleanedOptions[target] = convert(currentOption.target);

          break;
        case "popularity":
          cleanedOptions[min] = currentOption.min;
          cleanedOptions[max] = currentOption.max;
          cleanedOptions[target] = currentOption.target;
          break;
        case "tempo":
          cleanedOptions[min] = currentOption.min;
          cleanedOptions[max] = currentOption.max;
          cleanedOptions[target] = currentOption.target;
          break;
        default:
          // default 0.0 - 1.0
          cleanedOptions[min] = currentOption.min / 100;
          cleanedOptions[max] = currentOption.max / 100;
          cleanedOptions[target] = currentOption.target / 100;
          break;
      }
    }
  }

  return cleanedOptions;
}
