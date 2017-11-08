const clientId='33774561ff1e4d7abb5c444a8d662823';
let accessToken='';
const redirectURI = 'http://shanshanjammming-musicjammming.surge.sh';

const Spotify={
  getAccessToken(){
    if(accessToken){
      return new Promise(resolve => resolve(accessToken));
    } else{
      const accessTokenCheck = window.location.href.match(/access_token=([^&]*)/);
      const expiresInCheck = window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenCheck && expiresInCheck){
        accessToken=accessTokenCheck[1];
        const  expiresIn= Number(expiresInCheck[1]);
        window.setTimeout(() => accessToken ='', expiresIn * 1000);
        window.history.pushState('Access Token',null,'/');
        }
        else {
          window.location=`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
      return new Promise(
        resolve => resolve(accessToken)
      );
    }
  },

  search(term){
    return Spotify.getAccessToken().then(()=> {
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers:{Authorization:`Bearer ${accessToken}`
        }
      }).then(response => response.json()
    ).then(jsonResponse => {
          if(jsonResponse.tracks){
            return jsonResponse.tracks.items && jsonResponse.tracks.items.map(track =>{
              return {id:track.id,
                name:track.name,
                artist:track.artists[0].name,
                album:track.album.name,
                uri:track.uri
              };
            });
          }
          return [];
        }
      );
    });

  },

  savePlaylist(name,trackUris){
    if (!name || !trackUris.length) {
    return;
    }
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      let userId;
        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name})
          }).then(response => response.json()
          ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
              return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                headers: headers,
                method: 'POST',
                 body: JSON.stringify({uris: trackUris})
            });

      });

    });

  }
}

export default Spotify;
