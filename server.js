const express = require("express");
const request = require("request");
const fetch = require("node-fetch");
const querystring = require("querystring");

let app = express();
app.use(express.static("public"));

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:8888/callback";

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
  console.log(tracks);

  res.json(tracks);
});

let port = process.env.PORT || 3000;
console.log(
  `Listening on port ${port}. Go /login to initiate authentication flow.`
);
app.listen(port);
