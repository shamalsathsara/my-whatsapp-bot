// This file contains the logic for the weather command.
const fetch = require('node-fetch');

// This function handles the weather API call and response.
const handleWeatherCommand = async (message, location, apiKey) => {
    try {
        if (!location) {
            message.reply('Please provide a location to get the weather, like: !weather London');
            return;
        }

        // Extract location from args
        const locationQuery = Array.isArray(location) ? location.join(' ') : location;
        
        // First, get coordinates for the location
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationQuery)}&limit=1&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData || geoData.length === 0) {
            message.reply(`❌ Could not find location: ${locationQuery}`);
            return;
        }
        
        const { lat, lon, name, country: locationCountry } = geoData[0];
        
        // Now get weather data using coordinates
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
        const response = await fetch(weatherUrl);
        const data = await response.json();

        // Check for an error in the API response.
        if (data.cod && data.cod !== 200) {
            message.reply(`Error: ${data.message}`);
            return;
        }

        // Extract the weather details.
        const cityName = data.name;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        // Create the formatted weather report message.
        const weatherMessage = `
*Weather Report for ${name}, ${locationCountry}*

*Temperature:* ${temperature}°C (Feels like: ${feelsLike}°C)
*Condition:* ${description}
*Humidity:* ${humidity}%
*Wind Speed:* ${windSpeed} m/s
`;
        
        message.reply(weatherMessage.trim());

    } catch (error) {
        console.error('Error fetching weather data:', error);
        message.reply('An error occurred while trying to get the weather.');
    }
};

// Export the function so it can be used in the main bot file.
module.exports = {
    handleWeatherCommand
};
