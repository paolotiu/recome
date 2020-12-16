import express from "express";
import querystring from "querystring";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import request from "request";
import morgan from "morgan";
import cors from "cors";
const app = express();

dotenv.config();
app.use(morgan<express.Request>("dev"));
const redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";

const generateRandomString = function (length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";
// Typescript gets mad at the cors function for some reason
app.use(cors<express.Request>()).use(cookieParser());

// LOGIN WITH SPOTIFY OAUTH
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  // redirect to spotify login page
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          "user-read-private user-read-email user-library-read user-top-read",
        redirect_uri,
        state,
      })
  );
});

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
  refresh_token: string;
}

// Callback url from Spotify verification
const baseUrl = process.env.FRONTEND_URI || "http://localhost:3000";
app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  if (state === null || state !== storedState) {
    // if state does not match, error
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // gets and returns authentication token
    res.clearCookie(stateKey);
  }

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
    },

    json: true,
  };
  request.post(authOptions, (err, response, body) => {
    if (err) return res.status(400).json({ error: "Error in callback url" });

    const access_token = body.access_token;
    const refresh_token = body.refresh_token;
    res.redirect(baseUrl + "/?authorized=true&access_token=" + access_token);
  });
});

app.use("/", (req, res, next) => {
  res.json({ error: "endpoint not found" });
});

let port = process.env.PORT || 8888;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
