import { Options, SeedOptions } from "./../../types";
const def = {
  min: 0,
  max: 100,
  target: 50,
  isAuto: true,
};

export const defaulSeedOptions: SeedOptions = {
  seed_artists: ["placeholder"],
  seed_genres: ["placeholder"],
  seed_tracks: ["placeholder"],
};
export const defaultOptions: Options = {
  popularity: {
    ...def,
    name: "popularity",
    isAuto: false,
  },
  acousticness: {
    ...def,
    name: "acousticness",
  },
  danceability: { ...def, name: "danceability" },
  tempo: {
    ...def,
    name: "tempo",
  },
  energy: {
    ...def,
    name: "energy",
  },
  instrumentalness: {
    ...def,
    name: "instrumentalness",
  },
  liveness: {
    ...def,
    name: "liveness",
  },
  loudness: {
    ...def,
    name: "loudness",
  },

  speechiness: {
    ...def,
    name: "speechiness",
  },
  valence: {
    ...def,
    name: "valence",
  },
};
