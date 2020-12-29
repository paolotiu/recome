const querystring = require("querystring");

exports.handler = async function (event, context) {
  const redirect_uri =
    process.env.REDIRECT_URI || "http://localhost:8888/callback";
  return {
    statusCode: 302,
    headers: {
      Location:
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: 1234,
          scope:
            "user-library-modify user-read-private user-read-email user-library-read user-top-read playlist-modify-public playlist-modify-private",
          redirect_uri,
        }),
    },
  };
};
