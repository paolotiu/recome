const axios = require("axios");
const querystring = require("querystring");
exports.handler = async function (event, context) {
  const code = event.queryStringParameters.code;

  /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  const state = event.queryStringParameters.state;
  const redirect_uri =
    process.env.REDIRECT_URI ||
    "http://" + event.headers.host + "/.netlify/functions/callback";
  const appUrl = process.env.APP_URL || "http://localhost:8888/landing";
  const authOptions = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    }),
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };

  const res = await axios(authOptions);
  if (!res.data) {
    return {
      statusCode: 400,
      body: "Error",
    };
  } else {
    return {
      statusCode: 302,
      headers: {
        Location:
          appUrl + "/?authorized=true&access_token=" + res.data.access_token,
      },
    };
  }
};
