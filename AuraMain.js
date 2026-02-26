// Import necessary libraries
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path'); 


// Import the owner configuration from the owner.json file.
const ownerData = require('./owner.json');
const { BOT_NAME, BOT_PREFIX } = require('./bot_settings/settings.js'); 

// Access the King Aura bot's data
const KingAuraBot = ownerData.data.King_Aura;
const teamMembers = KingAuraBot.team;
console.log(teamMembers); 

// Import your custom plugins
const { handleWeatherCommand } = require('./plugins/weather.js');
const { handleChatCommand } = require('./plugins/gemini.js');
const { handleOwnerCommand } = require('./database/owner.js');
const { handleYoutubeCommand } = require('./plugins/youtube.js');
const { handlePanelCommand } = require('./plugins/menu.js');
const { handleTagAllCommand } = require('./plugins/tagall.js');
const { handleKickCommand } = require('./plugins/kick.js');
const { handlePrivateCommand, handlePublicCommand } = require('./plugins/mode.js');
const { handleSongCommand } = require('./plugins/song.js');
const { hnditData } = require('./plugins/hnditData.js');
const userSession = {};

const modeState = [false]; 
const apiKey = "AIzaSyAdUg_umzvOIJiLFcDrqRzVvczVjjEVXaE";
const weatherApiKey = "b5ddebf5e3cf059b5c869a6f34fd5dd5";

const botOwnerNumber = '94771581916@c.us';
const botMode = [false]; 

// Initialize the WhatsApp client with persistent session saving
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "aura-bot", 
        dataPath: './.wwebjs_auth' 
    }),
    puppeteer: {
        executablePath: '/usr/bin/google-chrome',
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu', // Added to save RAM
            '--no-zygote',
        ],
        headless: true,
        // Increased timeout for file injection
        waitForInitialPage: true,
        defaultNavigationTimeout: 60000 
    }
});

// Event listener for QR code
client.on('qr', qr => {
    console.log('QR RECEIVED. Please scan this code with your WhatsApp app.');
    qrcode.generate(qr, { small: true });
});

// Event listener for Ready state
client.on('ready', () => {
    console.log('Client is ready! The bot is now online.');
});

// Main message listener
client.on('message', async message => {
    if (message.fromMe) return;

    const chat = await message.getChat();
    console.log(`[${chat.name || message.from}] New message received: ${message.body}`);

    // --- UNIVERSITY NUMBER SELECTION HANDLER ---
    
    // --- STABLE PREMIUM UI HANDLER ---
if (!isNaN(message.body) && !message.body.startsWith('!')) {
    const selection = parseInt(message.body) - 1;
    const session = userSession[message.from] || { step: 'year' };

    // Return to Main Menu if 0 is pressed
    if (message.body === '0') {
        delete userSession[message.from];
        return message.reply("🔄 *Session Reset*\nType !uni to see the main menu.");
    }

    if (session.step === 'year') {
        const years = Object.keys(hnditData);
        if (years[selection]) {
            const selectedYear = years[selection];
            userSession[message.from] = { step: 'sem', year: selectedYear };
            
            const sems = Object.keys(hnditData[selectedYear]);
            let menu = `┏━━━━━━━━━━━━━━━━━━┓\n`;
            menu += `┃  🎓  *${selectedYear.toUpperCase()}* ┃\n`;
            menu += `┗━━━━━━━━━━━━━━━━━━┛\n\n`;
            menu += `📍 *Path:* ${selectedYear}\n\n`;
            menu += `*Select Semester:*\n\n`;
            sems.forEach((s, i) => menu += `${i + 1}️⃣ ${s}\n`);
            menu += `\n*0️⃣ Back to Main*`;
            await message.reply(menu);
        }
    } 
    else if (session.step === 'sem') {
        const sems = Object.keys(hnditData[session.year]);
        if (sems[selection]) {
            const selectedSem = sems[selection];
            userSession[message.from] = { step: 'subject', year: session.year, sem: selectedSem };

            const subjects = Object.keys(hnditData[session.year][selectedSem]);
            let menu = `┏━━━━━━━━━━━━━━━━━━┓\n`;
            menu += `┃  📚  *${selectedSem.toUpperCase()}* ┃\n`;
            menu += `┗━━━━━━━━━━━━━━━━━━┛\n\n`;
            menu += `📍 *Path:* ${session.year} > ${selectedSem}\n\n`;
            menu += `*Choose your Subject:*\n\n`;
            subjects.forEach((sub, i) => menu += `🔹 ${i + 1}. ${sub}\n`);
            menu += `\n*0️⃣ Reset Menu*`;
            await message.reply(menu);
        }
    }
    else if (session.step === 'subject') {
        const subjects = Object.keys(hnditData[session.year][session.sem]);
        if (subjects[selection]) {
            const selectedSub = subjects[selection];
            userSession[message.from] = { step: 'category', year: session.year, sem: session.sem, subject: selectedSub };

            let menu = `┏━━━━━━━━━━━━━━━━━━┓\n`;
            menu += `┃  📂  *RESOURCE BOX* ┃\n`;
            menu += `┗━━━━━━━━━━━━━━━━━━┛\n\n`;
            menu += `📝 *Subject:* ${selectedSub}\n`;
            menu += `📍 *Path:* ${session.sem} > ${selectedSub}\n\n`;
            menu += `1️⃣  Past Papers\n`;
            menu += `2️⃣  Marking Scheme\n`;
            menu += `3️⃣  Short Notes (KUPPI)\n\n`;
            menu += `✨ _Powered by Aura_Bot_`;
            await message.reply(menu);
        }
    }
    else if (session.step === 'category') {
        const subData = hnditData[session.year][session.sem][session.subject];
        const links = [subData.pastPapers, subData.markingScheme, subData.shortNotes];
        const labels = ["Past Papers", "Marking Scheme", "Short Notes"];

        if (links[selection]) {
            let successMsg = `✅ *DOWNLOAD READY*\n\n`;
            successMsg += `📄 *Type:* ${labels[selection]}\n`;
            successMsg += `📚 *Subject:* ${session.subject}\n\n`;
            successMsg += `🔗 *Link:* ${links[selection]}\n\n`;
            successMsg += `🚀 _Study hard, Shamal!_`;
            
            await message.reply(successMsg);
            delete userSession[message.from]; // Reset session
        }
    }
}

    // --- COMMAND HANDLER ---
    if (message.body.startsWith('!')) {
        const args = message.body.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
            case 'ping':
                message.reply('Ping is successful! The bot is online.');
                break;
            case 'resources':
            case 'uni':
                const years = Object.keys(hnditData);
                let menu = "🎓 *HNDIT RESOURCE HUB*\n\nSelect Year:\n\n";
                years.forEach((y, i) => menu += `${i + 1}. ${y}\n`);
                await message.reply(menu);
                break;

            case 'chat':
                await handleChatCommand(message, apiKey);
                break;
            case 'weather':
                await handleWeatherCommand(message, args, weatherApiKey);
                break;
            case 'owner':
                await handleOwnerCommand(message);
                break;
            case 'yt':
                await handleYoutubeCommand(message, args);
                break;
            case 'panel':
                await handlePanelCommand(message);
                break;
            case 'tagall':
                await handleTagAllCommand(message, client);
                break;
            case 'kick':
                await handleKickCommand(message, client);
                break;
            case 'song':
                await handleSongCommand(message, args);
                break;
        }
    }
});

client.initialize();