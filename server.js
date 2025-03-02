const express = require('express');
const app = express();
const axios = require('axios');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// Spotify API Credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = process.env.SPOTIFY_PLAYLIST_ID;

// YouTube API Credentials
const oAuth2Client = new google.auth.OAuth2(
    process.env.YT_CLIENT_ID,
    process.env.YT_CLIENT_SECRET,
    process.env.YT_REDIRECT_URI
);

const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });

let tokens = {}; // Store OAuth tokens

// =============================
// 🔹 FUNCTION: Get Spotify Access Token
// =============================
async function getSpotifyAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Spotify access token:', error.response?.data || error.message);
        return null;
    }
}

// =============================
// 🔹 FUNCTION: Fetch Tracks from Spotify Playlist
// =============================
async function getPlaylistTracks(playlistId, accessToken) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return response.data.items.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(artist => artist.name).join(', ')
        }));
    } catch (error) {
        console.error('Error fetching playlist tracks:', error.response?.data || error.message);
        return [];
    }
}







// =============================
// 🔹 ROUTE: GET THE HOME PAGE
// =============================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});

// =============================
// 🔹 ROUTE: Get Spotify Playlist name and id
// =============================

let playlistName = ''
let spotifyPlaylistId = ''
app.use(express.json())
app.post('/', (req, res) => {
    // Store received data in global variables
    playlistName = req.body.name;
    spotifyPlaylistId = req.body.playlistId;

    console.log(`Global Playlist Name: ${playlistName}`);
    console.log(`Global Songs List: ${spotifyPlaylistId}`);

    res.json({ redirectUrl: '/auth' });

})


// =============================
// 🔹 ROUTE: Get Spotify Playlist Tracks
// =============================
app.get('/playlist-songs', async (req, res) => {
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) return res.status(500).json({ error: 'Failed to get access token' });

    const tracks = await getPlaylistTracks(spotifyPlaylistId, accessToken);
    res.json(tracks);
});

// =============================
// 🔹 ROUTE: YouTube OAuth Flow
// =============================
app.get('/auth', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.force-ssl']
    });
    res.redirect(authUrl);
});

// Handle OAuth2 callback and save tokens
app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens: newTokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(newTokens);
        tokens = newTokens;
        res.redirect('/create-playlist');
    } catch (error) {
        res.status(400).json({ error: `Error during OAuth callback: ${error.message}` });
    }
});



// =============================
// 🔹 ROUTE: Create YouTube Playlist with Tracks from Spotify
// =============================
app.get('/create-playlist', async (req, res) => {
    console.log(playlistName)
    console.log("im in create-playlst")
    console.log(spotifyPlaylistId)
    // Fetch Spotify access token
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get Spotify access token' });
    }

    // Fetch playlist tracks from Spotify
    const tracks = await getPlaylistTracks(spotifyPlaylistId, accessToken);
    if (!tracks.length) {
        return res.status(404).json({ error: 'No tracks found in Spotify playlist' });
    }

    // Now, create a YouTube playlist
    if (!tokens.access_token) {
        return res.status(403).json({ error: 'User not authenticated on YouTube' });
    }
    console.log("playlist creating")




    try {
        // Create a YouTube playlist
        const playlistResponse = await youtube.playlists.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title: `'${playlistName}'`,
                    description: 'A playlist created from my Spotify playlist'
                },
                status: {
                    privacyStatus: 'public'  // You can change this to 'private' or 'unlisted'
                }
            }



        });
        console.log("playlist created")


        const playlistId = playlistResponse.data.id;
        const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

        // Search and add YouTube videos based on Spotify tracks
        const videoIds = [];
        for (const track of tracks) {
            const video = await searchYouTube(track.name, track.artist);
            if (video) {
                videoIds.push(video.videoId);
            }
        }

        // Add videos to the YouTube playlist
        await addVideosToPlaylist(playlistId, videoIds);

        res.json({
            message: 'Playlist created and videos added successfully!',
            playlistUrl: playlistUrl
        });

    } catch (error) {
        console.error('Error creating YouTube playlist or adding videos:', error.message);
        res.status(500).json({ error: 'Failed to create playlist or add videos.' });
    }
});




// =============================
// 🔹 FUNCTION: Search YouTube for a Video
// =============================
async function searchYouTube(songName, artist) {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: `${songName} ${artist}`,
                key: process.env.YT_YOUTUBE_API_KEY,
                type: 'video',
                maxResults: 1
            }
        });

        if (response.data.items.length > 0) {
            const video = response.data.items[0];
            return {
                videoId: video.id.videoId,
                title: video.snippet.title
            };
        }
        return null;
    } catch (error) {
        console.error('Error searching YouTube:', error.message);
        return null;
    }
}

// =============================
// 🔹 FUNCTION: Add Videos to YouTube Playlist
// =============================
async function addVideosToPlaylist(playlistId, videoIds) {
    try {
        for (const videoId of videoIds) {
            await youtube.playlistItems.insert({
                part: 'snippet',
                requestBody: {
                    snippet: {
                        playlistId: playlistId,
                        resourceId: {
                            kind: 'youtube#video',
                            videoId: videoId
                        }
                    }
                }
            });
        }
        console.log('Videos added to playlist successfully');
    } catch (error) {
        console.error('Error adding videos to playlist:', error.message);
    }
}

// =============================
// 🔹 Start the Server
// =============================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
