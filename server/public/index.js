const artistInputField = document.getElementById("artist-name-input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");

if (!access_token) {
  window.location.replace("/login");
}

async function getArtist(access_token) {
  const aritstInput = artistInputField.value;
  const response = await TracksRepository.getArtistName(
    access_token,
    aritstInput
  );

  const artistsArray = response.artists.items;

  for (let item of artistsArray) {
    if (item.name.toLowerCase() === aritstInput.toLowerCase()) {
      console.log(item);
    }
  }
}

button.addEventListener("click", async () => await getArtist(access_token));
