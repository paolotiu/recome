import toPairsIn from "lodash.topairsin";
import { SeedOptions, Options, AllTracksData } from "./../types";
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
export const getTopArtists = async (
  token: string,
  limit: number = 0,
  offset: number = 0,
  time_range: "long_term" | "medium_term" | "short_term" = "long_term"
) => {
  const res = await axios.get(
    url +
      `/me/top/artists?limit=${limit}&offset=${offset}&time_range=${time_range}`,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

// Get top 5 tracks
export const getTopTracks = async (
  token: string,
  limit: number = 5,
  offset: number = 0,
  time_range: "long_term" | "medium_term" | "short_term" = "long_term"
) => {
  const res = await axios.get(
    url +
      `/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${time_range}`,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

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
    url +
      "/recommendations?limit=50&" +
      stringifiedSeedOptions +
      stringifiedOptions,
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

export const getAllSavedTracks = async (
  token: string
): Promise<AllTracksData[]> => {
  const initial = await axios.get(url + "/me/tracks?limit=50", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  let next = initial.data.next;
  const data = [];

  while (next) {
    const res = await axios.get(next, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const temp = res.data.items.map((item: any) => {
      return {
        id: item.track.id,
        name: item.track.name,
        popularity: item.track.popularity,
        artistID: item.track.artists[0].id,
      };
    });
    data.push(...temp);
    next = res.data.next;
  }

  return data;
};

//get an artist
export const getGenresofArtists = async (
  token: string,
  artistArray: string[]
) => {
  const iterationNum = Math.ceil(artistArray.length / 50);
  const genres: string[] = [];
  for (let i = 1; i < iterationNum + 1; i++) {
    const start = (i - 1) * 50;
    const end = i * 50;
    const temp = artistArray.slice(start, end);
    const res = await axios.get(url + "/artists?ids=" + temp.join(","), {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    res.data.artists.forEach((x: any) => genres.push(...x.genres));
  }

  return genres;
};

// Create Playlist then add songs
export const createPlaylist = async (
  token: string,
  id: string,
  name: string,
  desc: string,
  uris: string[]
) => {
  const joined = uris.join(",");

  const playlist = await axios.post(
    url + "/users/" + id + "/playlists",
    {
      name: name,
      description: desc,
      public: true,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  await axios.post(
    url + "/playlists/" + playlist.data.id + "/tracks?uris=" + joined,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  return playlist.data;
};

export const saveOneTrack = async (token: string, id: string) => {
  const res = await axios.put(
    url + "/me/tracks?ids=" + id,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};

export const deleteOneTrack = async (token: string, id: string) => {
  const res = await axios.delete(url + "/me/tracks?ids=" + id, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
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
