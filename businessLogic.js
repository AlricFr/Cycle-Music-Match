// businessLogic.js

import { getUserData, getUserPlaylists, getRecommendation } from "./apiHandler.js";
import { currentToken } from "./script.js";
import { getSelectedGenre } from "./uiHandler.js";

async function createPlaylist(name) {
  console.log("Create Playlist Button Clicked");  
  const userData = await getUserData();
  const userID = userData.id;
  name = name + "-"+getSelectedGenre();
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

  export { createPlaylist, buildURI };
  