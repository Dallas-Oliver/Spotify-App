const artistInputField = document.getElementById("artist-name-input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");

if (!access_token) {
  window.location.replace("/login");
}

async function getTrack(access_token) {
  const aritstInput = artistInputField.value;

  console.log(await TracksRepository.getArtistName(access_token, aritstInput));
}

button.addEventListener("click", async () => await getTrack(access_token));
