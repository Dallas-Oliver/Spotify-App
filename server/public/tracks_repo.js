class TracksRepository {
  static async getTracks(access_token) {
    const tracks_req = await fetch(
      `/get-saved-tracks?access_token=${access_token}`
    );

    const JSON_data = await tracks_req.json();
    console.log(JSON_data);
    return JSON_data;
  }

  static async getSingleTrack(access_token, track_name) {
    const tracks_req = await fetch(
      `/get-track-info/${track_name}?access_token=${access_token}`
    );
    const track_info = await tracks_req.json();
    console.log(track_info);
  }
}
