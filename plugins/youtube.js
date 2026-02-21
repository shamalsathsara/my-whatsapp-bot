// This file has been completely rewritten to use 'yt-dlp'
// for a much more reliable and permanent solution to YouTube downloads.
// This is a more robust approach that uses a child process to call a dedicated
// download tool that is maintained by the community.

const { MessageMedia } = require('whatsapp-web.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// --- IMPORTANT ---
// 1. You MUST have 'yt-dlp' installed on your system.
//    - Windows: Download yt-dlp.exe and place it in your bot's directory.
//    - macOS/Linux: Install with `pip install yt-dlp`.
// 2. You need to use the `exec` function, which is a built-in Node.js module.

/**
 * Handles the "yt" command by downloading and sending a YouTube video or audio file
 * using the highly reliable 'yt-dlp' program.
 * The command supports two formats:
 * !yt mp4 <link> - Downloads the video in MP4 format.
 * !yt mp3 <link> - Downloads only the audio in MP3 format.
 * @param {import('whatsapp-web.js').Message} message The message object from the client.
 * @param {string[]} args An array of strings representing the command arguments.
 * @param {import('whatsapp-web.js').Client} client The client object from the main bot.
 */
const handleYoutubeCommand = async (message, args, client) => {
    let filename; // Declare filename here so it's available in the finally block.
    try {
        const subcommand = args[0] ? args[0].toLowerCase() : null;
        const query = args[1];
        
        // 1. Validate the command arguments.
        if (!subcommand || (subcommand !== 'mp4' && subcommand !== 'mp3')) {
            await message.reply('Please specify the format you want to download. Use *!yt mp4 <link>* or *!yt mp3 <link>*.');
            return;
        }

        if (!query) {
            await message.reply('❌ Please provide a valid YouTube video link.');
            return;
        }
        
        await message.reply('⏳ Starting download with yt-dlp... This may take a moment.');
        
        // Use a unique filename to avoid conflicts in a multi-user environment.
        const uniqueId = Math.random().toString(36).substring(7);
        const tempFilePath = path.join(os.tmpdir(), `yt_download_${uniqueId}`);

        let command;
        let fileType;
        let caption;

        if (subcommand === 'mp4') {
            fileType = 'video/mp4';
            filename = `${tempFilePath}.mp4`;
            caption = `✅ Video Downloaded`;
            // This command downloads a single file that contains both video and audio,
            // which avoids the need for FFmpeg to merge separate streams.
            command = `yt-dlp -f "best[ext=mp4]" --output "${filename}" ${query}`;
        } else { // mp3
            fileType = 'audio/mpeg';
            filename = `${tempFilePath}.mp3`;
            caption = `✅ Audio Downloaded`;
            // Command to extract only the audio as an mp3 file
            command = `yt-dlp -x --audio-format mp3 --output "${filename}" ${query}`;
        }
        
        // 2. Execute the yt-dlp command using async/await.
        // This is a more robust way to handle the flow and errors.
        try {
            // Wait for the download command to complete.
            // Increased maxBuffer to 10MB to handle larger metadata/stdout.
            await new Promise((resolve, reject) => {
                exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        // Note: yt-dlp often prints warnings to stderr, so we don't always reject here.
                    }
                    resolve(stdout);
                });
            });
        } catch (error) {
            if (error.message.includes('No such file or directory')) {
                throw new Error('❌ The yt-dlp program was not found. Please ensure it is installed correctly and in the right location.');
            } else if (error.message.includes('This video is unavailable')) {
                throw new Error('❌ This video is unavailable, restricted, or deleted.');
            } else {
                throw new Error(`❌ An error occurred during download: ${error.message}`);
            }
        }
        
        // 3. Check if the file was created and get its size.
        if (!fs.existsSync(filename)) {
            await message.reply('❌ File was not created. This may be due to a problem with the video or a download error.');
            return;
        }
        
        const stats = fs.statSync(filename);
        const maxFileSize = 16 * 1024 * 1024; // 16 MB WhatsApp limit

        if (stats.size > maxFileSize) {
            await message.reply(`⚠️ The downloaded file is too large (${(stats.size / 1024 / 1024).toFixed(2)} MB). I can only send files up to 16 MB.`);
        } else {
            // Read the file into a buffer before sending for better reliability.
            const fileBuffer = fs.readFileSync(filename);
            const media = new MessageMedia(fileType, fileBuffer.toString('base64'), path.basename(filename));

            // Use client.sendMessage() instead of message.reply() for better media handling.
            await client.sendMessage(message.from, media, { caption: caption });
            console.log(`Successfully sent file: ${filename}`);
        }

    } catch (error) {
        console.error('Error in handleYoutubeCommand:', error);
        await message.reply(error.message || '❌ An unexpected error occurred. Please try again.');
    } finally {
        // 4. Clean up the temporary file. This runs whether there's an error or not.
        if (filename && fs.existsSync(filename)) {
            fs.unlinkSync(filename);
            console.log(`Cleaned up temporary file: ${filename}`);
        }
    }
};

module.exports = {
    handleYoutubeCommand
};
