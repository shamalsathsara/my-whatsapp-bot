

// Import necessary libraries

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const fs = require('fs');
// Import the owner configuration from the owner.json file.
const ownerData = require('./owner.json');
const { BOT_NAME, BOT_PREFIX,  } = require('./bot_settings/settings.js'); // <-- Updated to match the new file structure
// Access the Queen Amdi bot's data
const KingAuraBot = ownerData.data.King_Aura;

// Get the team members' numbers
const teamMembers = KingAuraBot.team;
console.log(teamMembers); // This will print the array of phone numbers.

// Import your custom plugins from the plugins folder.      P L U G I N S

const { handleWeatherCommand } = require('./plugins/weather.js'); // <-- NEW
const { handleChatCommand } = require('./plugins/gemini.js'); // <-- Updated to match the new file structure
const { handleOwnerCommand } = require('./database/owner.js'); // <-- Updated to match the new file structure
const { handleYoutubeCommand } = require('./plugins/youtube.js'); // <-- Updated to match the new file structure
const { handlePanelCommand } = require('./plugins/menu.js'); // <-- Updated to match the new file structure
const { handleTagAllCommand } = require('./plugins/tagall.js'); // <-- Updated to match the new file structure
const { handleKickCommand } = require('./plugins/kick.js'); // <-- Updated to match the new file structure
const { handlePrivateCommand, handlePublicCommand } = require('./plugins/mode.js'); // <-- Updated to match the new file structure
const { handleSongCommand } = require('./plugins/song.js'); // <-- Updated to match the





const modeState = [false]; // This will hold the bot's mode state (private or public).
const apiKey = "AIzaSyAdUg_umzvOIJiLFcDrqRzVvczVjjEVXaE";
const weatherApiKey = "b5ddebf5e3cf059b5c869a6f34fd5dd5" ;

const botOwnerNumber = '94771581916@c.us';
const botMode = [false]; 




module.exports = {
    // ... other settings 
    // can add more settings here as your bot grows.
    BOT_NAME: 'King_Aura',
    BOT_PREFIX: '!'
};

// Initialize the WhatsApp client with a local authentication strategy.
//NEW EDITED FOR UBUNTU

const client = new Client({
    //authStrategy: new LocalAuth()

    puppeteer: {
        executablePath: '/usr/bin/google-chrome', // Use the path from Step 1
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Helps save RAM 
            '--disable-gpu'
        ],
    }

});


client.on('message', async message => 

    {
  // First, check the mode and if the user is the owner
  if (modeState[0] === true && !isOwner(message, botOwnerNumber)) {
    // If the bot is in private mode and the user is NOT the owner,
    // tell them they can't use commands.
    await message.reply('❌ The bot is currently in private mode. Only the owner can use commands.');
    return; // Stop processing the message
  }

  // If the above check passes (it's public mode or the user is the owner),
  // then your normal command logic runs below this line.

  // Your existing command logic
  if (message.body === '!help') {
    // ... run help command ...
  }
  
  if (message.body === '!some_other_command') {
    // ... run other command ...
  }
  
  // You would also call your mode handlers here
  if (message.body === '!private') {
    handlePrivateCommand(message, botOwnerNumber, modeState);
  } else if (message.body === '!public') {
    handlePublicCommand(message, botOwnerNumber, modeState);
  }
}
    

);











// Event listener for when the QR code is ready.
client.on('qr', qr => {
    console.log('QR RECEIVED. Please scan this code with your WhatsApp app.');
    qrcode.generate(qr, { small: true });
});

// Event listener for when the client is ready to use.
client.on('ready', () => {
    console.log('Client is ready! The bot is now online.');
});

// Event listener for incoming messages.
client.on('message', async message => {
    // Ignore messages from the bot itself.
    if (message.fromMe) {
        return;
    }
    
    // Log the incoming message for debugging.
    const chat = await message.getChat();
    console.log(`[${chat.name || message.from}] New message received: ${message.body}`);

    // Call external plugins here.
    let handled = false;
    let handledAsCommand = false;

    if (message.body.startsWith('!')) {
        const args = message.body.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
               case 'ping':
                message.reply('Ping is successful! The bot is online and responsive.');
                handledAsCommand = true;
                break;
            case 'help':
                const helpMessage = ``;
                message.reply(helpMessage.trim());
                handledAsCommand = true;
                break;
            case 'chat':
            case 'hi':
                console.log('Chat command triggered with API key:', apiKey ? 'Provided' : 'Missing');
                await handleChatCommand(message, apiKey);
                handledAsCommand = true;
                break;
            case 'weather':
                console.log('Weather command triggered with API key:', weatherApiKey ? 'Provided' : 'Missing');
                await handleWeatherCommand(message, args, weatherApiKey);
                handledAsCommand = true;
                break;
            case 'owner':
                console.log('Owner command triggered');
                await handleOwnerCommand(message);
                handledAsCommand = true;
                break;
            case 'yt':
                console.log('YouTube command triggered');
                await handleYoutubeCommand(message, args);
                handledAsCommand = true;
                break;
            case 'panel':
                console.log('Panel command triggered');
                await handlePanelCommand(message);
                handledAsCommand = true;
                break;
            case 'tagall':
                console.log('TagAll command triggered');
                await handleTagAllCommand(message, client);
                handledAsCommand = true;
                break;
            case 'kick':
                console.log('Kick command triggered');
                await handleKickCommand(message, client);
                handledAsCommand = true;
                break;
            case 'private':
                console.log('Private command triggered');
                await handlePrivateCommand(message, botOwnerNumber, botMode);
                handledAsCommand = true;
                break;
            case 'public':
                console.log('Public command triggered');
                await handlePublicCommand(message, botOwnerNumber, botMode);
                handledAsCommand = true;
                break;
            case 'song':
                console.log('Song command triggered');
                await handleSongCommand(message, args);
                handledAsCommand = true;
                break;

          /*  default:
                console.log(`Unrecognized command: ${command}`)
                message.reply('Sorry, I don\'t recognize that command. Try !help for a list of commands.');
                handledAsCommand = true;
                break; */
        }
    }

    // --- MODIFIED SECTION ---
    
    if (!handledAsCommand) {
        console.log('Default chat response triggered with API key:', apiKey ? 'Provided' : 'Missing');
        await handleChatCommand(message, apiKey);
    }
 
});

// Initialize the client to start the process.
client.initialize();









































