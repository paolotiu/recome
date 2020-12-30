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

export interface RecoResults {
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  artists: ResultArtist[];
  external_urls: {
    spotify: string;
  };
  album: {
    artists: ResultArtist[];
    images: ResultImage[];
  };
  uri: string;
}

export interface ResultImage {
  height: string;
  url: string;
}

export interface ResultArtist {
  id: string;
  name: string;
  href: string;
  popularity: number;
  images: ResultImage[];
}

export interface ResultTrack {
  id: string;
  name: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  album: {
    artists: ResultArtist[];
    images: ResultImage[];
  };
  artists: Array<{
    external_urls: {
      spotify: string;
    };
    id: string;
    name: string;
  }>;
  uri: string;

  popularity: number;
  preview_url: string;
}
export interface AudioFeaturesResult {
  audio_features: AudioFeature[];
}

export interface AudioFeature {
  acousticness: number;
  analysis_url?: string;
  danceability: number;
  duration_ms?: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key?: number;
  liveness: number;
  loudness: number;
  mode?: number;
  speechiness: number;
  tempo?: number;
  time_signature?: number;
  track_href?: string;
  type?: string;
  uri?: string;
  valence: number;
}

export interface CreatePlaylistResult {
  id: string;
  name: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface Artist {
  id: string;
  genre: string[];
}

export interface AllTracksData {
  id: string;
  name: string;
  popularity: number;
  artistID: string;
}
