class TracksRepository {
  static async getTopTracks(artist_id, access_token) {
    const top_tracks_response = await fetch(
      `/get-top-tracks/${artist_id}?access_token=${access_token}`
    );
    const top_tracks = await top_tracks_response.json();
    return top_tracks;
  }
}
