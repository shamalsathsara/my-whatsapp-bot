// This file handles the logic for the `!tagall` command.

const { MessageMedia } = require('whatsapp-web.js');

/**
 * Handles the "tagall" command by tagging all members in a group.
 * @param {import('whatsapp-web.js').Message} message The message object from the client.
 * @param {import('whatsapp-web.js').Client} client The client object from the main bot.
 */
const handleTagAllCommand = async (message, client) => {
    try {
        // Get the chat object where the message originated.
        const chat = await message.getChat();

        // Check if the chat is a group chat. If not, reply with an error and return.
        if (!chat.isGroup) {
            await message.reply('❌ This command can only be used in a group chat.');
            return;
        }

        // Get the chat's metadata and participants.
        const chatInfo = await client.getChatById(chat.id._serialized);
        
        // Find the bot's own participant entry in the group to check if it is an admin.
        // We use client.info.wid._serialized to get the bot's own ID.
        const botIsAdmin = chatInfo.participants.find(
            p => p.id._serialized === client.info.wid._serialized
        )?.isAdmin;

        // If the bot is not an admin, it cannot tag everyone.
        if (!botIsAdmin) {
            await message.reply('❌ I must be a group admin to use this command.');
            return;
        }

        // Extract the message the user wants to send with the tag.
        // We split the original message body by spaces and take everything after the `!tagall` command.
        const body = message.body.split(' ');
        const textToTag = body.slice(1).join(' ');

        // Get the participants from the chat.
        const participants = chat.participants;

        // Create an array of contact IDs to mention.
        const mentions = participants.map(p => p.id._serialized);

        // The final message to send, with all mentions.
        const messageWithMentions = `
*${textToTag || 'Attention everyone!'}*

${mentions.map(mention => `@${mention.replace('@s.whatsapp.net', '')}`).join(' ')}
`;

        // Send the message to the group.
        // We use client.sendMessage with the chat's ID and an options object containing the mentions.
        await client.sendMessage(chat.id._serialized, messageWithMentions.trim(), {
            mentions: mentions
        });

    } catch (error) {
        console.error('Error handling tagall command:', error);
        await message.reply('An error occurred while trying to tag everyone.');
    }
};

// Export the function so it can be used in the main bot file.
module.exports = {
    handleTagAllCommand
};
