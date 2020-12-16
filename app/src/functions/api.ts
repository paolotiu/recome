import axios from "axios";
const url = "https://api.spotify.com/v1";
axios.defaults.baseURL = url;

export const getUser = async (token: string) => {
  try {
    const res = await axios.get(url + "/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    console.log(res);
    return await res.data;
  } catch (err) {
    throw err;
  }
};
