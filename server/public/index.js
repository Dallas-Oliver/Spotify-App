const artistInputField = document.getElementById("artist-name-input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");
const player = document.getElementById("player");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");
const user_id = params.get("user_id");

if (!access_token) {
  window.location.replace("/login");
}

let count = 0;

async function createPlaylistHandler() {
  const artists = artistInputField.value.split(",").map(a => a.trim());
  // lone
  // tycho
  // red hot chili peppers
  await createTopPlaylist(artists);
}

async function createTopPlaylist(artist_names) {
  //create empty playlist ======================
  const playlist = await PlaylistRepository.createPlaylist(
    access_token,
    artist_names
  );

  // get info from server on all artists entered by the user=====
  const artists = await Promise.all(
    artist_names.map(artist_name => getArtist(artist_name))
  );
  //get artist ids from all artists===============
  const artist_ids = artists.map(artist => artist.id);
  //get top tracks info from all artists from the server======
  const top_songs_obj = await Promise.all(
    artist_ids.map(artist_id =>
      TracksRepository.getTopTracks(artist_id, access_token)
    )
  );
  //reduce top track info down to just tracks==========
  const top_songs = top_songs_obj.flatMap(top_song_obj => top_song_obj.tracks);
  //reduce further to just song ids=============
  const top_songs_uris = top_songs.map(song => song.uri);
  //add songs to newly created playlist===========
  await PlaylistRepository.addToPlaylist(
    access_token,
    playlist.id,
    top_songs_uris
  );

  // get top 5 tracks for each artists via
  // need artist id -> /v1/artists/{id}/top-tracks
  // then put these in playlist
}

async function getArtist(artist) {
  const response = await ArtistRepository.getArtistName(access_token, artist);
  const artistsArray = response.artists.items;

  return artistsArray.find(
    a => a.name.toLowerCase() === artist.toLowerCase() && a.genres.length > 0
  );
}

button.addEventListener("click", createPlaylistHandler);
