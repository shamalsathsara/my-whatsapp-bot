// This file handles the logic for the !private and !public commands.

/**
 * Checks if the message sender is the bot owner.
 * @param {import('whatsapp-web.js').Message} message The message object.
 * @param {string} botOwnerNumber The serialized phone number of the bot owner.
 * @returns {boolean} True if the sender is the owner, false otherwise.
 */
const isOwner = (message, botOwnerNumber) => {
    // The message.from property is the serialized ID of the sender.
    // We compare it to the serialized ID of the bot owner.
    return message.from === botOwnerNumber;
};

/**
 * Handles the "!private" command.
 * Sets the bot to private mode, where only the owner can use commands.
 * @param {import('whatsapp-web.js').Message} message The message object.
 * @param {string} botOwnerNumber The serialized phone number of the bot owner.
 * @param {boolean[]} modeState A single-element array to hold the bot's mode state.
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
 * Sets the bot to public mode, where everyone can use commands.
 * @param {import('whatsapp-web.js').Message} message The message object.
 * @param {string} botOwnerNumber The serialized phone number of the bot owner.
 * @param {boolean[]} modeState A single-element array to hold the bot's mode state.
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
