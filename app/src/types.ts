export interface IUser {
  displayName: string;
  product: string;
  followers: number;
  id: string;
  url: string;
}

export interface SeedOptions {
  seed_tracks: string[];
  seed_genres: string[];
  seed_artists: string[];
}

export interface Options {
  [popularity: string]: SingleOption;
  acousticness: SingleOption;
  danceability: SingleOption;
  tempo: SingleOption;
  energy: SingleOption;
  instrumentalness: SingleOption;
  liveness: SingleOption;
  loudness: SingleOption;
  speechiness: SingleOption;
  valence: SingleOption;
}

export interface SingleOption {
  name: string;
  target: number;
  min: number;
  max: number;
  isAuto: boolean;
}

export interface TargetOption {
  target: number;
}

export interface MinMaxOptions {
  min: number;
  max: number;
}

export interface TopResult {
  items: ResultItem[];
}

export interface ResultItem {
  genres: string[];
  id: string;
}
