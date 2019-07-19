class TracksRepository {
  static async getArtistName(access_token, artist_name) {
    const artist_req = await fetch(
      `/get-track-info/${artist_name}?access_token=${access_token}`
    );

    const artist_info = await artist_req.json();
    return artist_info;
  }
}
