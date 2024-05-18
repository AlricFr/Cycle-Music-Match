// businessLogic.js

async function createPlaylist(name, genreSeed) {
    const userData = await getUserData();
    const userID = userData.id;
  
    // Creating a new playlist
    const response = await fetch(
      "https://api.spotify.com/v1/users/speedjunkee/playlists",
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
  
    // Add a song to the playlist
    const trackResponse = await fetch(`https://api.spotify.com/v1/playlists/${truePlaylist}/tracks`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + currentToken.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: ['spotify:track:3kiTnvHHKipoAwa40GTGGy'],
        position: 0,
      }),
    });
  }
  
  export { createPlaylist };
  