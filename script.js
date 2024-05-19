// script.js

import { redirectToSpotifyAuthorize, loginWithSpotifyClick, logoutClick, refreshTokenClick, renderTemplate } from './uiHandler.js';
import { getToken, refreshToken, getUserData, getUserPlaylists, getGenres, getFollowedArtists, getRecommendation } from './apiHandler.js';
import { buildURI } from './businessLogic.js';


// should be in API Handler -> here only a getCurrentToken function should be called
// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token() { return localStorage.getItem('access_token') || null; },
  get refresh_token() { return localStorage.getItem('refresh_token') || null; },
  get expires_in() { return localStorage.getItem('refresh_in') || null },
  get expires() { return localStorage.getItem('expires') || null },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('expires_in', expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + (expires_in * 1000));
    localStorage.setItem('expires', expiry);
  }
};

// On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
const code = args.get('code');

// If we find a code, we're in a callback, do a token exchange
if (code) {
  const token = await getToken(code);
  currentToken.save(token);

  // Remove code from URL so we can refresh correctly.
  const url = new URL(window.location.href);
  url.searchParams.delete("code");

  const updatedUrl = url.search ? url.href : url.href.replace('?', '');
  window.history.replaceState({}, document.title, updatedUrl);
}


// If we have a token, we're logged in, so fetch user data and render logged in template
if (currentToken.access_token) {
  const userData = await getUserData();
  const userPlaylists = await getUserPlaylists();
  const genres = await getGenres();
  const genreObj = genres.genres;
  // console.log("GenreObj");
  // console.log(genreObj);
  renderTemplate("main", "playlist-select", userData);
  renderTemplate("playlist", "playlist-create", userData);
  // const obj = userPlaylists.items;
  // const selectGenre = document.getElementById("genre-list");
  // genreObj.forEach((item) => {
  //   const selectItem = document.createElement("li");
  //   selectItem.value = item;
  //   selectItem.textContent = item;
  //   selectItem.classList.add("card");
  //   selectGenre.appendChild(selectItem);
  // });

  const userFollowedArtists = await getFollowedArtists();
  console.log(userFollowedArtists);
  const artistsObj  =userFollowedArtists.artists.items;
  console.log("ArtistsObj");
  console.log(artistsObj);
  
  // Below fills the artist list which I turned off to focus on working with recommendations to funnel them to a new playlist
  // const artistList = document.getElementById("artist-list");
  // artistsObj.forEach((item) => {
  //  // console.log(item);
  //   const artistCard = document.createElement("div");
  //   artistCard.classList.add("card");

  //   const artistImageContainer = document.createElement("div");
  //   artistImageContainer.classList.add("card-image-container");

  //     const artistImage = document.createElement("img");
  //     artistImage.src = item.images[2].url;
  //     const artistName = document.createElement("p");
  //     artistName.classList.add("card-title");
  //     artistName.textContent =item.name;
    
  //   //artistCard.textContent = item.name;
    
    
    
  //   artistCard.appendChild(artistImage);
  //   artistCard.appendChild(artistName);
    
  //   artistList.appendChild(artistCard);

  // })

  //Below is transfered to businessLogic.js inside the create Playlist function
  // const recommendations = await getRecommendation();
  // const recommendationObj = await recommendations.tracks;
  // console.log("Recommendations:");
  // console.log(recommendations);
  // console.log("Recommendation Obj:");
  // console.log(recommendationObj);

  // buildURI(recommendationObj);
  // renderTemplate("oauth", "oauth-template", currentToken);
}

// Otherwise we're not logged in, so render the login template
if (!currentToken.access_token) {
  renderTemplate("main", "login");
}

export { currentToken };
