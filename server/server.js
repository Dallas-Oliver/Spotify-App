const express = require("express");
const request = require("request");
const fetch = require("node-fetch");
const querystring = require("querystring");
require("dotenv").config();

let app = express();
app.use(express.static("public"));

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:3000/callback";

app.get("/login", function(req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email user-library-read",
        redirect_uri
      })
  );
});

app.get("/callback", function(req, res) {
  let code = req.query.code || null;

  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64")
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;

    res.redirect("/?access_token=" + access_token);
  });
});

app.get("/get-saved-tracks", async (req, res) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  };
  const tracks_req = await fetch(
    "https://api.spotify.com/v1/me/tracks?limit=10",
    options
  );
  const tracks = await tracks_req.json();

  res.json(tracks);
});

app.get("/get-track-info/:artist", async (req, res) => {
  console.log(req.params.track_info);
  const artist_req = req.params.artist.split(",");
  const artist_info = artist_req[0];

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  };

  const track_req = await fetch(
    `https://api.spotify.com/v1/search?q=artist:"${artist_info}"&type=artist`,
    options
  );
  const track = await track_req.json();
  console.log(track);
  res.json(track);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Listening on port ${port}. Go /login to initiate authentication flow.`
  );
});
