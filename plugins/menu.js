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


         const panelMessage = `
        
               👑 𝐓𝐇𝐈𝐒 𝐈𝐒 𝐊𝐈𝐍𝐆 𝐀𝐔𝐑𝐀 𝐏𝐀𝐍𝐄𝐋 𝐋𝐈𝐒𝐓 👑  \n


   ⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️


   🤖  𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝙱𝚢 :- 🆂🅷🅰🅼🅼🅰✍
   

 ❗𝗼𝘄𝗻𝗲𝗿     - Get bot owner details.
 ❗𝘄𝗲𝗮𝘁𝗵𝗲𝗿   - Get the weather details.
 ❗𝘆𝘁         - Download a YouTube video.
 ❗𝗳𝗯         - Download a Facebook video.
 ❗𝘁𝗶𝗸𝘁𝗼𝗸     - Download a TikTok video.
 ❗𝗶𝗴         - Download on Instagram .
 ❗𝗶𝗺𝗮𝗴𝗲     - Generate image.
 ❗𝗰𝗵𝗮𝘁      - Talk to the AI. 
 ❗𝗽𝗶𝗻𝗴      - Check bot status.
 ❗𝗵𝗲𝗹𝗽      - Get a list of all commands.
 ❗kick    - Kick a user from the group.
 ❗tagall  - Tag all members in the group.
  
                                                                          `;
        
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
