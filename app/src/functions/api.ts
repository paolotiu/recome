import axios from "axios";
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
  const res = await axios.get(url + "/me/top/artists?limit=5", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};

// Get top 5 tracks
export const getTopTracks = async (token: string) => {
  const res = await axios.get(url + "/me/top/tracks?limit=5", {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.data;
};
