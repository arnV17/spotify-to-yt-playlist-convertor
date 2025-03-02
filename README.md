# **Spotify to YouTube Playlist Converter 

## **Slide 1: Title Slide**
### **Spotify to YouTube Playlist Converter**
- Convert your favorite Spotify playlists into YouTube playlists effortlessly.
- A seamless and automated process.

(Include an image of your app’s home screen or logo.)

---

## **Slide 2: Introduction**
### **What does this app do?**
- Fetches playlists from Spotify.
- Searches for corresponding YouTube videos.
- Creates a new YouTube playlist.
- Adds matched videos automatically.

(Include a simple flowchart or infographic.)

---

## **Slide 3: Prerequisites**
### **What you need to get started:**
- Node.js installed
- Spotify API credentials
- YouTube Data API credentials

(Screenshot of API credential setup process.)

---

## **Slide 4: Installation**
### **How to set up the project**
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/spokon.git
   cd spokon
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure the `.env` file with your API keys.

(Screenshot of terminal commands being executed.)

---

## **Slide 5: Running the Application**
### **How to Start the App**
- Run the following command:
   ```sh
   npm start
   ```
- Open your browser and go to `http://localhost:8080`.

(Screenshot of the app running in a terminal and browser.)

---

## **Slide 6: Step-by-Step Usage**
### **Step 1: Enter Spotify Playlist URL**
- Paste the link into the input field.
- Click “Transform Playlist.”

(Screenshot of inputting Spotify URL.)

### **Step 2: Authenticate YouTube Account**
- Click “Authorize” and log in to YouTube.
- Grant the required permissions.

(Screenshot of YouTube OAuth login page.)

### **Step 3: Playlist Creation**
- The app searches for matching YouTube videos.
- Creates a new YouTube playlist and adds songs.

(Screenshot of a successfully created YouTube playlist.)

---

## **Slide 7: API Endpoints Overview**
- **`/playlist-songs`** - Fetches songs from Spotify.
- **`/auth`** - Handles YouTube authentication.
- **`/create-playlist`** - Converts Spotify songs to a YouTube playlist.

---

## **Slide 8: Troubleshooting & FAQs**
### **Common Issues & Fixes**
- **Issue:** Authentication failure
  - **Fix:** Ensure correct API keys in `.env` file.
- **Issue:** Songs not matching on YouTube
  - **Fix:** Modify search parameters for better results.

---

## **Slide 9: Conclusion**
- Open-source and easy-to-use.
- Expandable with new features.
- Contributions are welcome!

(Include a call to action: “Try it now!” with a link to the repository.)

---

## **Slide 10: Thank You!**
- Contact & support information.
- GitHub repository link.

(Include an image of the final working YouTube playlist.)

