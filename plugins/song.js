const play = require("play-dl");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");

async function handleSongCommand(message, args) {
    try {
        if (args.length === 0) {
            await message.reply("❌ Please provide a song name or YouTube link.\nExample: !song Despacito");
            return;
        }

        const query = args.join(" ");
        let songUrl = null;
        let songInfo = null;

        // --- Case 1: User gave a direct YouTube link ---
        if (play.yt_validate(query) === "video") {
            songUrl = query;
            songInfo = await play.video_info(songUrl);
        } 
        // --- Case 2: Search by keywords ---
        else {
            await message.reply(`🎶 Searching for *${query}* ...`);
            const searchResult = await play.search(query, { limit: 1 });
            if (!searchResult || searchResult.length === 0) {
                await message.reply("❌ No results found.");
                return;
            }

            const song = searchResult[0];
            songUrl = song.url || `https://www.youtube.com/watch?v=${song.id}`;
            songInfo = song;
        }

        // --- Stream audio ---
        const stream = await play.stream(songUrl);
        const filePath = `./temp_${Date.now()}.mp3`;
        const writeStream = fs.createWriteStream(filePath);

        stream.stream.pipe(writeStream);

        writeStream.on("finish", async () => {
            const media = MessageMedia.fromFilePath(filePath);

            // Send with nice caption
            const title = songInfo?.title || "Unknown Title";
            const channel = songInfo?.channel?.name || "Unknown Artist";

            await message.reply(media, undefined, {
                caption: `🎵 *${title}*\n👤 ${channel}\n🔗 ${songUrl}`
            });

            fs.unlinkSync(filePath); // cleanup
        });

    } catch (err) {
        console.error("Song command error:", err);
        await message.reply("⚠️ Error downloading the song. Try again later.");
    }
}

module.exports = { handleSongCommand };
