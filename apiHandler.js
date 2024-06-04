// apiHandler.js
import { currentToken } from "./script.js";
import { getSelectedGenre, getSelectedRideLength, getPlaylistName } from "./uiHandler.js";
import { getAudioFeatures } from "./businessLogic.js";

// Constants
const clientId = 'f025bd23871b4827a30382a923a7eeba'; // your clientId
// const redirectUrl = 'http://127.0.0.1:5500/index.html'; // your redirect URL - must be localhost URL and/or HTTPS
// const redirectUrl = 'https://alricfr.github.io/Cycle-Music-Match/'; // your redirect URL - must be localhost URL and/or HTTPS
const redirectUrl = 'http://pedalbeats.app';
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const currentUserPlaylists = "https://api.spotify.com/v1/me/playlists";
const scope = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public user-follow-read';

async function getToken(code) {
  const code_verifier = localStorage.getItem('code_verifier');

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: currentToken.refresh_token
    }),
  });

  return await response.json();
}

async function getUserData() {
  const response = await fetch("https://api.spotify.com/v1/me", {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });

  return await response.json();
}

async function getUserPlaylists() {
  const response = await fetch(currentUserPlaylists, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });

  return await response.json();
}

async function getGenres() {
  console.log("Called the getGenre Method - only static genres to reduce API calls");
  // Enable below if all genres would be needed 
  // const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
  //   method: 'GET',
  //   headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  // });
  const response = {"genres": ["alternative", "samba", "hip-hop", "classic", "rock", "afrobeat", "club", "deep-house", "drum-and-bass","electro","hard-rock","power-pop", "techno"]};
  console.log(response);
  //return await response.json();
  return response;
}

//parameters need to be refined, prob. best to hand in an array with potentially empty fields than handing over single arguments
async function getRecommendation() {
  // const seedArtists = null;
  const seedGenre = getSelectedGenre();
  const limit = getDesiredPlaylistLength();
  const tempo  = getAudioFeatures()[0];
  const energy = getAudioFeatures()[1];
  console.log("Selected Genre");
  console.log(seedGenre);
  console.log("Limit is "+ limit);
  // const seedTracks = null;

  // const url = `https://api.spotify.com/v1/recommendations?seed_artists=${seedArtists}&seed_genres=${seedGenre}&seed_tracks=${seedTracks}`;
  const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=${seedGenre}&target_energy=${energy}&target_tempo=${tempo}`;

  console.log("URL: " + url);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + currentToken.access_token,
    },
  });

  // console.log("Recommendation");
  // console.log(response);
  return await response.json();
}

function getDesiredPlaylistLength(){
  const desiredDuration = getSelectedRideLength();
  const averageSongLength = 4/60; //in hrs to match the entry
  var requiredSongs = Math.round(desiredDuration/averageSongLength);
  requiredSongs = requiredSongs +5;
    
  if(requiredSongs>100){
    window.alert("Playlist must be less than 4 hrs long. Will create a 4hr long playlist")
    return 100;
  }

  return requiredSongs;
}


async function getAuthorizationURL(){
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  window.localStorage.setItem("code_verifier", code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };
  authUrl.search = new URLSearchParams(params).toString();

  return authUrl;
}

function getRedirectUrl(){
  return redirectUrl;
}

async function getFollowedArtists(){
  const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + currentToken.access_token },
  });
  console.log("artists");
  console.log(response);
  return await response.json();
}

export {
  getToken,
  refreshToken,
  getUserData,
  getUserPlaylists,
  getGenres,
  getAuthorizationURL,
  getRedirectUrl,
  getFollowedArtists,
  getRecommendation,
  getDesiredPlaylistLength
};
