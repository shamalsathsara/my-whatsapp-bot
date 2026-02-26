




const path = require('path');
// Import the owner data from the JSON
const ownerData = require('../owner.json');

// This function sends a message with the bot owner's details.
const handleOwnerCommand = async (message) => {
    try {
       
        const botDetails = ownerData.data.King_Aura; 

        if (!botDetails) {
            message.reply('Sorry, the bot owner information is not available.');
            return;
        }

        const ownerMessage = `
*Bot Owner Details:*
*Name:* ${botDetails.owner}
*Number:* ${botDetails.number.join(', ')}
*Emoji:* ${botDetails.emoji}
*Team:* ${botDetails.team.join(', ')}
`;
        

        
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
