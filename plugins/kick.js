// This file handles the logic for the `!kick` command.

/**
 * Handles the "!kick" command to remove a user from a group.
 * @param {import('whatsapp-web.js').Message} message The message object from the client.
 * @param {import('whatsapp-web.js').Client} client The client object from the main bot.
 */
const handleKickCommand = async (message, client) => {
    try {
        const chat = await message.getChat();

        // Check if the command was used in a group chat.
        if (!chat.isGroup) {
            await message.reply('❌ This command can only be used in a group chat.');
            return;
        }

        // Get the participant info of the user who sent the message.
        const sender = await message.getContact();
        const senderIsAdmin = chat.participants.find(p => p.id._serialized === sender.id._serialized)?.isAdmin;

        // Check if the sender is a group admin.
        if (!senderIsAdmin) {
            await message.reply('❌ You must be a group admin to use this command.');
            return;
        }

        // Check if the bot is a group admin.
        const botId = client.info.wid._serialized;
        const botIsAdmin = chat.participants.find(p => p.id._serialized === botId)?.isAdmin;

        if (!botIsAdmin) {
            await message.reply('❌ I must be a group admin to kick participants.');
            return;
        }

        // Get the participant to be kicked. This works for replies or mentions.
        let participantToKick = null;
        if (message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            participantToKick = await quotedMsg.getContact();
        } else if (message.mentionedIds.length > 0) {
            participantToKick = await client.getContactById(message.mentionedIds[0]);
        } else {
            await message.reply('❌ Please reply to a message or mention the user you want to kick.');
            return;
        }
        
        // Prevent kicking the bot itself or a group admin.
        if (participantToKick.id._serialized === botId) {
            await message.reply('❌ I cannot kick myself.');
            return;
        }
        
        const participantToKickIsAdmin = chat.participants.find(p => p.id._serialized === participantToKick.id._serialized)?.isAdmin;
        if (participantToKickIsAdmin) {
            await message.reply('❌ I cannot kick an admin.');
            return;
        }

        // Get the kick message from the command body.
        const args = message.body.split(' ').slice(1);
        const kickMessage = args.length > 0 ? args.join(' ') : 'Kicked Out from the group. 😂 ';
        
        // Announce the kick message before the actual kick.
        await client.sendMessage(chat.id._serialized, kickMessage);

        // Perform the kick operation.
        await chat.removeParticipants([participantToKick.id._serialized]);
        
        // Send a confirmation message.
        await client.sendMessage(chat.id._serialized, `✅ Kicked ${participantToKick.id.user} successfully.`);

    } catch (error) {
        console.error('Error handling kick command:', error);
        await message.reply('An error occurred while trying to kick the participant.');
    }
};

module.exports = { handleKickCommand };
