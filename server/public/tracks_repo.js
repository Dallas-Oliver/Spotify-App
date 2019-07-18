class TracksRepository {
  static async getTracks(access_token) {
    const tracks_req = await fetch(
      `/get-saved-tracks?access_token=${access_token}`
    );

    const JSON_data = await tracks_req.json();
    console.log(JSON_data);
    return JSON_data;
  }

  static async getArtistName(access_token, artist_name) {
    const artist_req = await fetch(
      `/get-track-info/${artist_name}?access_token=${access_token}`
    );

    const artist_info = await artist_req.json();
    return artist_info;
  }
}
