class TracksRepository {
  static async getTracks(access_token) {
    const tracks_req = await fetch(
      `/get-saved-tracks?access_token=${access_token}`
    );

    const JSON_data = await tracks_req.json();
    console.log(JSON_data);
  }
}
