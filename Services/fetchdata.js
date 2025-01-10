const axios = require('axios');
const Crypto = require('../models/cryptomodel');  // Import the Crypto model

const fetchAndStoreData = async (coinid) => {
    try {
        // Construct the URL dynamically based on coin ID
        const url = `https://api.coingecko.com/api/v3/coins/${coinid}`;

        // Fetch the data using axios with async/await
        const response = await axios.get(url, {
            headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.API_KEY }
        });

        // Check if the response is successful
        if (!response.data) {
            throw new Error('No data found in the response.');
        }

        // Extract the required data from the response
        const coinData = {
            name: response.data.id,  // Name of the coin (e.g., 'bitcoin', 'ethereum')
            price: response.data.market_data.current_price.usd,
            marketCap: response.data.market_data.market_cap.usd,
            change_24h: response.data.market_data.price_change_percentage_24h,  // 24h price change percentage
        };

        // Create a new instance of the Crypto model with the extracted data
        const crypto = new Crypto(coinData);

        // Save the new cryptocurrency data to MongoDB
        await crypto.save();

        // console.log(coinData);
        

        console.log(`Data for ${coinid} successfully stored in the database.`);
    } catch (error) {
        console.error('Error fetching or storing data:', error.message);
    }
};

module.exports = fetchAndStoreData;
