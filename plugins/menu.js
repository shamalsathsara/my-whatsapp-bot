// This file handles the "!panel" command for the bot.

const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');

/**
 * Handles the "panel" command by sending a list of bot commands.
 * @param {import('whatsapp-web.js').Message} message The message object from the client.
 */
const handlePanelCommand = async (message) => {
    try {
        // Define the list of commands for the panel.
        // You can easily add more commands here in the future.

        const imagePath = path.join(__dirname, '..', 'Images', 'owner_image.jpg');
        const media = MessageMedia.fromFilePath(imagePath);

        // Define the path to the audio file.
        const audioPath = path.join(__dirname, '..', 'Audios', 'voiceline.mp3');
        const audioMedia = MessageMedia.fromFilePath(audioPath);

       await message.reply(audioMedia, null, { ptt: true });


         const panelMessage =  `
╔═══════════════════════════╗
     🔱  *𝐊𝐈𝐍𝐆 𝐀𝐔𝐑𝐀 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐂𝐄𝐍𝐓𝐄𝐑* 🔱
╚═══════════════════════════╝

👤 *OWNER:* Shamal Sathsara
🆔 *DEV:* WeAreCooked
⚙️ *PREFIX:* !

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📥  *MEDIA DOWNLOADERS* ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ▸ !𝘆𝘁      - Download YouTube Videos
  ▸ !𝗳𝗯      - Download Facebook Videos
  ▸ !𝘁𝗶𝗸𝘁𝗼𝗸  - Download TikTok Videos
  ▸ !𝗶𝗴      - Download Instagram Posts

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🤖  *AI & UTILITIES*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ▸ !𝘂𝗻𝗶     - HNDIT Resource Hub 🎓
  ▸ !𝗰𝗵𝗮𝘁    - Talk to Gemini AI
  ▸ !𝗶𝗺𝗮𝗴𝗲   - Generate AI Images
  ▸ !𝘄𝗲𝗮𝘁𝗵𝗲𝗿 - Real-time Weather Info

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🛡️  *GROUP MANAGEMENT*
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ▸ !𝘁𝗮𝗴𝗮𝗹𝗹  - Mention All Members
  ▸ !𝗸𝗶𝗰𝗸    - Remove User from Group
  ▸ !𝗼𝘄𝗻𝗲𝗿   - Contact Developer
  ▸ !𝗽𝗶𝗻𝗴    - Check System Latency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      ✨ _Always evolving, King Aura_ ✨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        

        
        // Reply to the user with the formatted panel list.
     await message.reply(media, null, { caption: panelMessage.trim() });
        console.log('Panel command executed successfully.');

    } catch (error) {
        // Log any errors that occur during the process.
        console.error('Error handling panel command:', error);
        message.reply('An error occurred while trying to display the panel list.');
    }
};

// Export the function so it can be used in the main bot file.
module.exports = {
    handlePanelCommand
};
