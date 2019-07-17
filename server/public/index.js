const trackInputField = document.getElementById("track-name-input-field");
const artistInputField = document.getElementById("artist-name-input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");

if (!access_token) {
  window.location.replace("/login");
}

async function trackListing(access_token) {
  console.log(await TracksRepository.getTracks(access_token));
}

async function getTrack(access_token) {
  const trackInput = trackInputField.value;
  const aritstInput = artistInputField.value;

  console.log(
    await TracksRepository.getSingleTrack(access_token, trackInput, aritstInput)
  );
}

button.addEventListener("click", async () => await getTrack(access_token));
