// This file handles the logic for the !private and !public commands.

/**
 * Checks if the message sender is the bot owner.
 * @param {import('whatsapp-web.js').Message} message 
 * @param {string} botOwnerNumber 
 * @returns {boolean} 
 */
const isOwner = (message, botOwnerNumber) => {
    return message.from === botOwnerNumber;
};

/**
 * Handles the "!private" command.
 * @param {import('whatsapp-web.js').Message} message 
 * @param {string} botOwnerNumber 
 * @param {boolean[]} modeState 
 */
const handlePrivateCommand = async (message, botOwnerNumber, modeState) => {
    if (!isOwner(message, botOwnerNumber)) {
        await message.reply('❌ This command can only be used by the bot owner.');
        return;
    }
    modeState[0] = true; // Set the mode to private (true).
    await message.reply('✅ *King_Aura🤖* is now in *private* mode. Only the owner [*Shamal_Sathsara*] can use commands.');
};

/**
 * Handles the "!public" command.
 
 * @param {import('whatsapp-web.js').Message} message 
 * @param {string} botOwnerNumber  phone number of the bot owner.
 * @param {boolean[]} modeState  hold the bot's mode state.
 */
const handlePublicCommand = async (message, botOwnerNumber, modeState) => {
    if (!isOwner(message, botOwnerNumber)) {
        await message.reply('❌ This command can only be used by the bot owner.');
        return;
    }
    modeState[0] = false; // Set the mode to public (false).
    await message.reply('✅ *King_Aura🤖* is now in *public* mode. Everyone can use commands.');
};

module.exports = {
    handlePrivateCommand,
    handlePublicCommand
};
