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
    const access_token = body.access_token;

    res.redirect("/?access_token=" + access_token);
  });
});

app.get("/get-user-id", async (req, res) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  };
  const user_req = await fetch("https://api.spotify.com/v1/me", options);
  const user_object = await user_req.json();
  console.log(user_object);
  res.json(user_object);
});

app.get("/get-track-info/:artist", async (req, res) => {
  const artist_params = req.params.artist.split(",");
  const artist_info = artist_params[0];

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
  const artist = await track_req.json();

  res.json(artist);
});

app.post("create-playlist/:user_id", async (req, res) => {
  const user_id = req.params.user_id;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`,
      "Content-Type": "application/json"
    }
  };
  const newPlaylist_req = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    options
  );
  const newPlaylist = await newPlaylist_req.json();
  res.json(newPlaylist);
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Listening on port ${port}. Go /login to initiate authentication flow.`
  );
});
