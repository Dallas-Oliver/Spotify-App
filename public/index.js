const inputField = document.getElementById("input-field");
const button = document.getElementById("search-button");
const results = document.getElementById("results");

const params = new URLSearchParams(window.location.search);
const access_token = params.get("access_token");

if (!access_token) {
  window.location.replace("/login");
}

button.addEventListener(
  "click",
  async () => await TracksRepository.getTracks(access_token)
);
