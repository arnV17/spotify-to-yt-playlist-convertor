# Spotify to YouTube Playlist Converter

A JavaScript-based tool that converts Spotify playlists into YouTube playlists effortlessly.

## Features
- Convert Spotify playlists into YouTube playlists
- Authenticate using Spotify and YouTube APIs
- Supports public and private playlists


## Prerequisites
-Node.js
- Spotify Developer Account & API Credentials
- YouTube Data API v3 Credentials

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/spotify-to-yt-converter.git
   cd spotify-to-yt-converter
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Set up API credentials:
   - Create a `.env` file and add the following:
     ```sh
     SPOTIFY_CLIENT_ID=your_spotify_client_id
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     YOUTUBE_API_KEY=your_youtube_api_key
     ```

## Usage
Run the script using:
```sh
python convert.py --spotify-playlist-id <playlist_id>
```

## Configuration
- Modify `config.py` to adjust settings.
- Update API keys in the `.env` file.

## Troubleshooting
- Ensure API credentials are correct.
- Check rate limits for Spotify and YouTube APIs.

## Contributions
Pull requests are welcome! Please ensure code follows the existing style.

## License
MIT License

