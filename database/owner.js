



// This file handles the owner command logic.
const path = require('path');
// Import the owner data from the JSON file.
const ownerData = require('../owner.json');

// This function sends a message with the bot owner's details.
const handleOwnerCommand = async (message) => {
    try {
        // Access the owner information for your bot.
        // The key in your JSON file is "King_Aura", so we'll use that here.
        const botDetails = ownerData.data.King_Aura; 

        if (!botDetails) {
            message.reply('Sorry, the bot owner information is not available.');
            return;
        }

        // Create the message with owner details.
        // We'll also join the "team" array to display it nicely.
        const ownerMessage = `
*Bot Owner Details:*
*Name:* ${botDetails.owner}
*Number:* ${botDetails.number.join(', ')}
*Emoji:* ${botDetails.emoji}
*Team:* ${botDetails.team.join(', ')}
`;
        
        // FIX: Temporarily remove the image sending part to isolate the issue.
        // It seems the MessageMedia object is causing an internal library error

        
        // Send the text message only.
        await message.reply(ownerMessage.trim());

    } catch (error) {
        console.error('Error handling owner command:', error);
        message.reply('An error occurred while trying to get the owner details.');
    }
};

// Export the function so it can be used in the main bot file.
module.exports = {
    handleOwnerCommand
};
