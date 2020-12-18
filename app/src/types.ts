export interface IUser {
  displayName: string;
  product: string;
  followers: number;
  id: string;
  url: string;
}

export interface Options {
  seed_tracks: string[];
  seed_genres: string[];
  seed_artists: string[];
  popularity?: SingleOption;
  acousticness?: SingleOption;
  danceability?: SingleOption;
  tempo?: SingleOption;
  energy?: SingleOption;
  instrumentalness?: SingleOption;
  liveness?: SingleOption;
  loudness?: SingleOption;
  mode?: SingleOption;
  speechiness?: SingleOption;
  time_signature?: SingleOption;
  valence?: SingleOption;
  duration?: SingleOption;
}

export interface SingleOption {
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
