// This is an updated Express.js server that uses the 'play-dl' library,
// which is more stable than 'ytdl-core' for YouTube downloads.

const express = require('express');
const playdl = require('play-dl');
const cors = require('cors');

// This is the core logic for the YouTube downloader server.
const app = express();

// Enable CORS for security so your bot can connect to it.
app.use(cors());

// --- GET VIDEO INFO ---
// This endpoint gets the title of a YouTube video.
app.get('/info', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
            return res.status(400).send('Invalid YouTube URL provided.');
        }

        const info = await playdl.video_info(url);
        res.json({ title: info.video_details.title });

    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).send('Failed to get video info. The URL may be invalid or the video is private.');
    }
});

// --- MP4 VIDEO DOWNLOAD ---
// This endpoint downloads and streams a YouTube video in MP4 format.
app.get('/mp4', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
            return res.status(400).send('Invalid YouTube URL provided.');
        }

        const videoInfo = await playdl.video_info(url);
        // CORRECTED: The quality is now an integer, 18, which corresponds to 360p.
        const stream = await playdl.stream(url, { quality: 18 });
        
        // Use the video title to set the filename.
        const filename = `${videoInfo.video_details.title}.mp4`;
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Type', 'video/mp4');

        // Stream the video to the response.
        stream.pipe(res);

    } catch (error) {
        console.error('Error downloading MP4:', error);
        res.status(500).send('Failed to download video. It may be too long or restricted.');
    }
});

// --- MP3 AUDIO DOWNLOAD ---
// This endpoint downloads and streams a YouTube video's audio in MP3 format.
app.get('/mp3', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
            return res.status(400).send('Invalid YouTube URL provided.');
        }

        const audioInfo = await playdl.video_info(url);
        // CORRECTED: We now use the filter option to get only audio.
        const stream = await playdl.stream(url, { filter: 'audioonly' });

        // Use the video title to set the filename.
        const filename = `${audioInfo.video_details.title}.mp3`;
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Type', 'audio/mpeg');

        // Stream the audio to the response.
        stream.pipe(res);
        
    } catch (error) {
        console.error('Error downloading MP3:', error);
        res.status(500).send('Failed to download audio.');
    }
});

// Set the port for the server to listen on.
const PORT = 3500;
app.listen(PORT, () => {
    console.log(`YouTube Downloader server listening on port ${PORT}`);
});
