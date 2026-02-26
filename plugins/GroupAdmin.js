// plugins/GroupAdmin.js
const groupAdminHandler = async (client, message, command) => {
    try {
        console.log(`[DEBUG] Executing logic for: ${command}`);
        if (!message.isGroupMsg) return;

        const chat = await message.getChat();
        
        // 1. Verify Bot Permissions
        const botId = client.info.wid._serialized;
        const botParticipant = chat.participants.find(p => p.id._serialized === botId);
        
        if (!botParticipant?.isAdmin) {
            console.log("[DEBUG] FAILED: Bot is not an admin.");
            return await message.reply("❌ I need to be an **Admin** to do this.");
        }

        // 2. Verify Sender Permissions
        const senderId = message.author || message.from;
        const senderParticipant = chat.participants.find(p => p.id._serialized === senderId);

        if (!senderParticipant?.isAdmin) {
            console.log("[DEBUG] FAILED: User is not an admin.");
            return; 
        }

        // 3. Execution with explicit boolean values

        // Inside GroupAdmin.js execution logic

if (command.includes('lock') && !command.includes('unlock')) {
    try {
        // Try the primary method
        await chat.setMessagesAdminsOnly(true); 
        await message.reply("🔒 *Group Locked:* Only admins can message.");
        console.log("[DEBUG] Successfully sent lock command to WA servers");
    } catch (err) {
        console.log("[DEBUG] Lock failed, trying backup method...");
        // Backup method for some library versions
        await chat.setInfoAdminsOnly(true); 
        await message.reply("⚠️ Message lock failed, but Group Info is now Admin-only.");
    }
} 
else if (command.includes('unlock')) {
    await chat.setMessagesAdminsOnly(false);
    await message.reply("🔓 *Group Unlocked:* Everyone can message.");
    console.log("[DEBUG] Successfully sent unlock command to WA servers");
}
       
    } catch (e) {
        console.error("Admin Command Failed:", e);
        // This will tell you if it's a "Protocol error" or "Permission denied"
        await message.reply(`⚠️ Error: ${e.message}`);
    }
};

module.exports =  groupAdminHandler ;