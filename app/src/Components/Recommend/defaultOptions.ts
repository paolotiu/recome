import { Options } from "./../../types";
const def = {
  min: 0,
  max: 100,
  target: 50,
  isAuto: true,
};
export const defaultOptions: Options = {
  seed_artists: ["placeholder"],
  seed_genres: ["placeholder"],
  seed_tracks: ["placeholder"],
  popularity: {
    ...def,
  },
  acousticness: {
    ...def,
  },
  danceability: { ...def },
  tempo: {
    ...def,
  },
  energy: {
    ...def,
  },
  instrumentalness: {
    ...def,
  },
  liveness: {
    ...def,
  },
  loudness: {
    ...def,
  },
  mode: {
    ...def,
  },
  speechiness: {
    ...def,
  },
  time_signature: {
    ...def,
  },
  valence: {
    ...def,
  },
  duration: {
    ...def,
  },
};
