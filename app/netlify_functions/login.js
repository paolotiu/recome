const querystring = require("querystring");

exports.handler = async function (event, context, callback) {
  const redirect_uri =
    process.env.REDIRECT_URI ||
    "http://" + event.headers.host + "/.netlify/functions/callback";

  return {
    statusCode: 302,
    headers: {
      Location:
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: "b05090c06a3f4a6b8f4331bf32413345",
          scope:
            "user-library-modify user-read-private user-read-email user-library-read user-top-read playlist-modify-public playlist-modify-private",
          redirect_uri,
          state: "",
        }),
    },
  };
};
