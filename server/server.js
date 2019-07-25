const express = require("express");
const request = require("request");
const fetch = require("node-fetch");
const querystring = require("querystring");

const baseApiUri = "https://api.spotify.com/v1";

require("dotenv").config();

let app = express();
app.use(express.static("public"));
app.use(express.json());

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:3000/callback";

app.get("/login", function(req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope:
          "user-read-private user-read-email user-library-read playlist-modify-private playlist-modify-public",
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
  request.post(authOptions, async (error, response, body) => {
    const access_token = body.access_token;

    const user_id = await get_user_id(access_token);

    res.redirect(`/?access_token=${access_token}&user_id=${user_id}`);
  });
});

async function get_user_id(access_token) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  };
  const user_req = await fetch(`${baseApiUri}/me`, options);
  const user = await user_req.json();
  console.log(user);
  return user.id;
}

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
    `${baseApiUri}/search?q=artist:"${artist_info}"&type=artist`,
    options
  );
  const artist = await track_req.json();

  res.json(artist);
});

app.get("/get-top-tracks/:artist_id", async (req, res) => {
  const artist_id = req.params.artist_id;

  const top_tracks_req = await fetch(
    `${baseApiUri}/artists/${artist_id}/top-tracks?country=US`,
    get_get_options(req)
  );
  const top_tracks = await top_tracks_req.json();
  res.json(top_tracks);
});

function get_get_options(req) {
  return {
    method: "GET",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`
    }
  };
}

function get_post_options(req, body) {
  return {
    method: "POST",
    headers: {
      Authorization: `Bearer ${req.query.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

app.post("/create-playlist/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  const new_playlist_req = await fetch(
    `${baseApiUri}/users/${user_id}/playlists`,
    get_post_options(req, {
      name: `Top Songs by ${req.body.artists.join(", ")}`
    })
  );
  const new_playlist = await new_playlist_req.json();

  res.json(new_playlist);
});

app.post("/add-tracks-to-playlist/:playlist_id", async (req, res) => {
  const playlist_id = req.params.playlist_id;

  const add_to_playlist_req = await fetch(
    `${baseApiUri}/playlists/${playlist_id}/tracks`,
    get_post_options(req, {
      uris: req.body.uris
    })
  );
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Listening on port ${port}. Go /login to initiate authentication flow.`
  );
});
