const artistInputField = document.getElementById("artist-name-input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");

if (!access_token) {
  window.location.replace("/login");
}

(async function getUserInfo(access_token) {
  const response = await fetch(`/get-user-id/?access_token=${access_token}`);
  const userObj = await response.json();
  console.log(userObj);
})(access_token);

async function getArtist(access_token) {
  const aritstInput = artistInputField.value;
  const response = await TracksRepository.getArtistName(
    access_token,
    aritstInput
  );

  const artistsArray = response.artists.items;

  for (let item of artistsArray) {
    if (
      item.name.toLowerCase() === aritstInput.toLowerCase() &&
      item.genres.length > 0
    ) {
      console.log(item);
    }
  }
}

button.addEventListener("click", async () => await getArtist(access_token));
