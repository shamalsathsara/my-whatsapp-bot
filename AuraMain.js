// Import necessary libraries
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path'); 

function logError(error) {
    const timestamp = new Date().toLocaleString();
    const errorLog = `[${timestamp}] ERROR: ${error.stack || error}\n`;
    fs.appendFileSync('crash_logs.txt', errorLog);
}

// Import the owner configuration
const ownerData = require('./owner.json');
const { BOT_NAME, BOT_PREFIX } = require('./bot_settings/settings.js'); 

// Import custom plugins
const { handleWeatherCommand } = require('./plugins/weather.js');
const   groupAdminHandler  = require('./plugins/GroupAdmin.js'); // Fixed import
const { handleChatCommand } = require('./plugins/gemini.js');
const { handleOwnerCommand } = require('./database/owner.js');
const { handleYoutubeCommand } = require('./plugins/youtube.js');
const { handlePanelCommand } = require('./plugins/menu.js');
const { handleTagAllCommand } = require('./plugins/tagall.js');
const { handleKickCommand } = require('./plugins/kick.js');
const { handlePrivateCommand, handlePublicCommand } = require('./plugins/mode.js');
const { handleSongCommand } = require('./plugins/song.js');
const { hnditData } = require('./plugins/hnditData.js');

const userSession = {}; // Fixed initialization
const apiKey = "AIzaSyAdUg_umzvOIJiLFcDrqRzVvczVjjEVXaE";
const weatherApiKey = "b5ddebf5e3cf059b5c869a6f34fd5dd5";

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
            '--disable-gpu',
            '--no-zygote',
        ],
        headless: true,
        waitForInitialPage: true,
        defaultNavigationTimeout: 60000 
    }
});

client.on('qr', qr => {
    console.log('QR RECEIVED. Scan with WhatsApp.');
    qrcode.generate(qr, { small: true });
});

//Start bot
client.on('ready', () => {
    
    // Color codes
    const cyan = "\x1b[36m";
    const yellow = "\x1b[33m";
    const green = "\x1b[32m";
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";

    console.clear(); // Clears the terminal for a fresh look
    console.log(cyan + bold + `
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                            ┃
    ┃   🌟  ${BOT_NAME.toUpperCase()} IS NOW ONLINE          ┃
    ┃                                            ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛` + reset);

    console.log(yellow + bold + `    > DEVELOPED BY: ` + reset + `ShAmMa`);
    console.log(yellow + bold + `    > TEAM:         ` + reset + `DaRk`);
    console.log(yellow + bold + `    > STATUS:       ` + reset + green + `Active ✅` + reset);
    console.log(cyan + `    ──────────────────────────────────────────` + reset);
    console.log(green + `    [${new Date().toLocaleTimeString()}] System stabilized. Waiting for messages...` + reset);
});

////////////////////////////////////////////////////////////////////////////
///////////////// MAIN MSG LISTENER ////////////////////////////////////////

client.on('message', async message => {
    try {
        // 1. INITIALIZE COMMAND VARIABLE FIRST
        const body = message.body || "";
        const args = body.trim().split(/ +/);
        const command = args.shift().toLowerCase();
        const userName = message._data?.notifyName || "Student"; // Extracted user name

        // 2. ADMIN CHECK 
        if (command === '!lock' || command === '!unlock') {
            await groupAdminHandler(client, message, command);
            return; 
        }

        if (message.fromMe) return;
        const chat = await message.getChat();
        console.log(`[${chat.name || message.from}] Message: ${message.body}`);

        // --- HNDIT RESOURCE SELECTION LOGIC ---
        if (!isNaN(message.body) && !message.body.startsWith('!')) {
            const selection = parseInt(message.body) - 1;
            const session = userSession[message.from] || { step: 'year' };

            if (message.body === '0') {
                delete userSession[message.from];
                return message.reply("🔄 *Session Reset*\nType !uni to see the menu.");
            }

            if (session.step === 'year') {
                const years = Object.keys(hnditData);
                if (years[selection]) {
                    const selectedYear = years[selection];
                    userSession[message.from] = { step: 'sem', year: selectedYear };
                    const sems = Object.keys(hnditData[selectedYear]);
                    let menu = `┏━━━━━━━━━━━━━━━━━━┓\n┃  🎓  *${selectedYear.toUpperCase()}* ┃\n┗━━━━━━━━━━━━━━━━━━┛\n\nSelect Semester:\n`;
                    sems.forEach((s, i) => menu += `${i + 1}️⃣ ${s}\n`);
                    await message.reply(menu);
                }
            } 
            else if (session.step === 'sem') {
                const sems = Object.keys(hnditData[session.year]);
                if (sems[selection]) {
                    const selectedSem = sems[selection];
                    userSession[message.from] = { step: 'subject', year: session.year, sem: selectedSem };
                    const subjects = Object.keys(hnditData[session.year][selectedSem]);
                    let menu = `┏━━━━━━━━━━━━━━━━━━┓\n┃  📚  *${selectedSem.toUpperCase()}* ┃\n┗━━━━━━━━━━━━━━━━━━┛\n\nChoose Subject:\n`;
                    subjects.forEach((sub, i) => menu += `🔹 ${i + 1}. ${sub}\n`);
                    await message.reply(menu);
                }
            }
            else if (session.step === 'subject') {
                const subjects = Object.keys(hnditData[session.year][session.sem]);
                if (subjects[selection]) {
                    const selectedSub = subjects[selection];
                    userSession[message.from] = { step: 'category', year: session.year, sem: session.sem, subject: selectedSub };
                    let menu = `┏━━━━━━━━━━━━━━━━━━┓\n┃  📂  *RESOURCE BOX* ┃\n┗━━━━━━━━━━━━━━━━━━┛\n\n1️⃣ Past Papers\n2️⃣ Marking Scheme\n3️⃣ Short Notes\n\n✨ _Aura_Bot_`;
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
                    successMsg += `🚀 _Study hard, ${userName}!_`; // Personalized message
                    
                    await message.reply(successMsg);
                    delete userSession[message.from];
                }
            }
        }

        // --- COMMAND SWITCH HANDLER ---
        if (message.body.startsWith('!')) {
            // Remove the prefix for the switch check
            const cmdName = command.startsWith('!') ? command.slice(1) : command;

            switch (cmdName) {
                case 'ping':
                    message.reply('Ping successful! Online.');
                    break;
                case 'uni':
                case 'resources':
                    const years = Object.keys(hnditData);
                    let menu = "🎓 *HNDIT RESOURCE HUB*\n\nSelect Year:\n";
                    years.forEach((y, i) => menu += `${i + 1}. ${y}\n`);
                    await message.reply(menu);
                    break;
                case 'stats':
                    const uptime = process.uptime();
                    const hours = Math.floor(uptime / 3600);
                    const memory = (process.memoryUsage().heapUsed/1024/1024).toFixed(2);
                    await message.reply(`🤖 *Aura_Bot Stats*\nUptime: ${hours}h\nMemory: ${memory}MB\nUser: ${userName}`);
                    break;
                case 'chat': await handleChatCommand(message, apiKey); break;
                case 'weather': await handleWeatherCommand(message, args, weatherApiKey); break;
                case 'yt': await handleYoutubeCommand(message, args); break;
                case 'tagall': await handleTagAllCommand(message, client); break;
                case 'kick': await handleKickCommand(message, client); break;

                case 'lock':
                case 'unlock':
                await groupAdminHandler(client, message, command); 

                default:
                    await message.reply(`❌ Unknown Command: !${cmdName}\nType !uni for help.`);
                    break;
            }
        }
    } catch (error) {
        logError(error); // Log to crash_logs.txt
        console.error("Aura_Bot Error:", error);
        await message.reply("⚠️ Aura_Bot encountered an error, but is still running! 🤖");
    }
});

client.initialize();