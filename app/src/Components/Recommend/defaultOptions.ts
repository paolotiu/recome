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

export const CustomModalStyles = {
  overlay: {
    backgroundColor: "rgba(170,170,170, 0.2)",
  },
  content: {
    display: "grid",
    position: "relative",
    gap: "1.2em",
    top: "30%",
    left: "50%",
    width: "clamp(270px, 30vw, 500px)",
    maxWidth: "80vw",
    right: "auto",
    bottom: "auto",
    borderRadius: "24px",
    marginRight: "-50%",
    transform: "translate(-50%, -30%)",
    backgroundColor: "#393939",
    border: "none",
    textTransform: "capitalize",
    overflow: "visible",
  } as React.CSSProperties,
};

export const helpTip: { [key: string]: string } = {
  acousticness:
    "A confidence measure whether the track is acoustic. 100 represents high confidence the track is acoustic.",
  danceability:
    "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.",
  energy:
    "Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.",
  instrumentalness:
    "Predicts whether a track contains no vocals. “Ooh” and “aah” sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly “vocal”.",
  liveness:
    "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.",
  loudness:
    "The overall loudness of a track. Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks.",
  popularity:
    "The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.",
  speechiness:
    "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 100 the attribute value.",
  tempo: "The overall estimated tempo of a track in beats per minute (BPM)",
  valence:
    "	A measure from 0 to 100 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive",
};
