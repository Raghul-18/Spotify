// script.js

const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const scopes = ['user-top-read'];

// Function to authenticate and get the access token
function authenticateWithSpotify() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');

  if (!accessToken) {
    window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`);
  }

  return accessToken;
}

// Function to get the user's top tracks
function getTopTracks(accessToken) {
  return fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  })
  .then(response => response.json())
  .then(data => data.items);
}

// Function to get audio features of a track
function getAudioFeatures(accessToken, trackId) {
  return fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  })
  .then(response => response.json());
}

// Function to display top tracks and audio features in the console
function displayTopTracksAndAudioFeatures() {
  const accessToken = authenticateWithSpotify();

  getTopTracks(accessToken)
    .then(topTracks => {
      console.log('Top Tracks:');
      topTracks.forEach(track => {
        console.log(`${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`);
        getAudioFeatures(accessToken, track.id)
          .then(audioFeatures => {
            console.log('Audio Features:', audioFeatures);
            console.log('\n');
          })
          .catch(error => console.error('Error fetching audio features:', error));
      });
    })
    .catch(error => console.error('Error fetching top tracks:', error));
}

// Call the function to display results in the console
displayTopTracksAndAudioFeatures();
