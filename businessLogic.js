import { getUserData, getUserPlaylists, getRecommendation, handleResponse } from "./apiHandler.js";
import { currentToken } from "./script.js";
import { getSelectedGenre, getPlaylistName, getRideIntensity, renderTemplate } from "./uiHandler.js";

async function createPlaylist() {
  console.log("Create Playlist Button Clicked");  
  const userData = await getUserData();
  const userID = userData.id;
  const name = getPlaylistName();
  // name = name + "-"+getSelectedGenre();
  console.log("This is the Playlist name " + name);

    const response = await fetch(
      `https://api.spotify.com/v1/users/${userID}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + currentToken.access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: "This is an auto-generated playlist",
          public: "false",
        }),
      }
    );

    handleResponse(response);
  
    // Get playlist ID of the just created playlist
    let allPlaylists = await getUserPlaylists();
    allPlaylists = allPlaylists.items;
    const truePlaylist = allPlaylists[0].id;
    console.log("TruePlaylist"+truePlaylist);
  
    //gotta fetch recommendations here to hand over as trackArray
    const recommendations = await getRecommendation();
    const recommendationObj = await recommendations.tracks;
    console.log("RecommendationObject");
    console.log(recommendationObj);
    const uri = await buildURI(recommendationObj);
    // const uri = ["spotify:track:2aibwv5hGXSgw7Yru8IYTO",
    //               "spotify:track:0wJ2epgYbxJEkaEYfONaon",
    //               "spotify:track:5H6Jp0syB5yEPk7SWYdlmk"
    // ];
    console.log(uri);
    
    console.log(JSON.stringify({uris: uri, position: 0,}))
    // Add a song to the playlist
    const trackResponse = await fetch(`https://api.spotify.com/v1/playlists/${truePlaylist}/tracks`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + currentToken.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: uri,
        position: 0
      }),
    });

    handleResponse(trackResponse);
    //Still needs the reaction on error handling -> show different than just warning screen
    renderTemplate("main","playlist-creation-success", userData)

  }
  
async function buildURI(trackArray){
  console.log("Track Array Log");
  console.log(trackArray);
  let uri = [];
  trackArray.forEach(track => {
    const id = track.id;
    // console.log("TrackID " + id);
    // uri += "spotify:track:"+id+","
    uri.push("spotify:track:"+id);
    // console.log(uri);
  });

  return uri;
}

//maps what audiofeatures should be supplied based on the ride intensity
function getAudioFeatures(){
  var intensity = getRideIntensity();
  var tempo;
  var energy;
  
  //console.log("Intensity "+intensity);

  if(intensity=="flat"){
    tempo = 150;
    energy = 0.9;
  }
  if(intensity=="climb"){
    tempo = 100;
    energy = 0.8;
  }
  if(intensity=="calm"){
    tempo = 80;
    energy = 0.5;
  }
  // console.log("Tempo: "+tempo+" Energy: "+energy);
  return [tempo,energy];
}

  export { createPlaylist, buildURI, getAudioFeatures };
  