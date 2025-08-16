// Import necessary libraries
const handleChatCommand = async (message, apiKey) => {
    try {
        // Log the API key status for debugging
        console.log('API Key Status:', apiKey ? 'Provided' : 'Missing or Empty');
        if (!apiKey) {
            console.error('API key is missing. Please set a valid API key in bot.js');
            message.reply('The bot is not configured with an API key. Please check the bot configuration.');
            return;
        }

        // Prepare the prompt for the generative model.
        const prompt = `You are a helpful and friendly chatbot. Based on the following message, provide a short, conversational response.
        User: "${message.body}"
        Your response:`;

        // Set up the chat history and payload for the API call.
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // Log the API URL (without exposing the key)
        console.log('Making API call to:', apiUrl.replace(apiKey, '***HIDDEN***'));

        // Make the API call to the generative model.
        // We can now use the built-in fetch function directly.
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Log the response status
        console.log('API Response Status:', response.status);

        const result = await response.json();
        
        // Log the full response for debugging (be careful with sensitive data)
        console.log('API Response:', JSON.stringify(result, null, 2));
        
        // Check if the response is valid and get the text.
        const generatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
            console.log('Generated response:', generatedText);
            message.reply(generatedText);
        } else {
            console.error('API response structure is unexpected or content is missing.');
            message.reply('I am having a little trouble thinking of a response right now.');
        }
    } catch (error) {
        console.error('Error calling the generative API:', error);
        message.reply('An error occurred while trying to generate a response.');
    }
};

// Export the function so it can be imported and used elsewhere.
export {
    handleChatCommand
};
