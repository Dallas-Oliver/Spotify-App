class PlaylistRepository {
  static async createPlaylist(access_token, artists) {
    const playlist_req = await fetch(
      `/create-playlist/${user_id}?access_token=${access_token}`,
      {
        method: "POST",
        body: JSON.stringify({ artists: artists }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const playlist = await playlist_req.json();
    console.log(playlist);
    return playlist;
  }

  static async addToPlaylist(access_token, playlist_id, song_uris) {
    await fetch(
      `/add-tracks-to-playlist/${playlist_id}?access_token=${access_token}`,
      {
        method: "POST",
        body: JSON.stringify({ uris: song_uris }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
