require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchAndStoreData = require('./services/fetchData');
const Crypto = require('./models/cryptomodel')
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const startApp = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Schedule the job
    cron.schedule('0 */2 * * *', () => {
      console.log('Fetching and storing crypto data...');
      fetchAndStoreData('bitcoin');
      fetchAndStoreData('matic-network');
      fetchAndStoreData('ethereum');
    });

    
    console.log('Background job scheduled to run every 2 hours.');
  } catch (error) {
    console.error('Error starting application:', error.message);
    process.exit(1);
  }
};



const fetchCoinData = async (coin) => {
    try {
        // Construct the URL for CoinGecko API
        const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
        
        // Fetch the data from CoinGecko using axios
        const response = await axios.get(url, {
            headers: { accept: 'application/json', 'x-cg-demo-api-key': 'CG-Jx3Fm2inDJbtiKfhYcPuPgeH' }
        });

        // Extract and return the relevant data
        return {
            price: response.data.market_data.current_price.usd,
            marketCap: response.data.market_data.market_cap.usd,
            "24hChange": response.data.market_data.price_change_percentage_24h,
        };
    } catch (error) {
        throw new Error(`Error fetching data for ${coin}: ${error.message}`);
    }
};

const calculateStandardDeviation = (prices) => {
  const n = prices.length;
  const mean = prices.reduce((acc, price) => acc + price, 0) / n;
  const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / n;
  return Math.sqrt(variance);
};

app.get('/stats', async (req, res) => {
    try {
        const { coin } = req.query; 
        
        // Validate if coin is one of the allowed coins
        const allowedCoins = ['bitcoin', 'ethereum', 'matic-network'];
        if (!allowedCoins.includes(coin)) {
            return res.status(400).json({ error: 'Invalid coin. Valid coins are bitcoin, ethereum, matic-network.' });
        }

        // Fetch the latest data for the requested coin
        const coinData = await fetchCoinData(coin);

        // Send the response with the cryptocurrency data
        res.status(200).json(coinData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/deviation', async (req, res) => {
  try {
      const { coin } = req.query;

      // Validate the `coin` query parameter
      const allowedCoins = ['bitcoin', 'ethereum', 'matic-network'];
      if (!allowedCoins.includes(coin)) {
          return res.status(400).json({ error: 'Invalid coin. Valid coins are bitcoin, ethereum, matic-network.' });
      }

      // Fetch the last 100 records for the requested cryptocurrency
      const records = await Crypto.find({ name: coin })
          .sort({ timestamp: -1 }) // Sort by timestamp in descending order
          .limit(100); // Limit to the last 100 records

      // Check if there are enough records
      if (records.length === 0) {
          return res.status(404).json({ error: `No records found for ${coin}` });
      }

      const prices = records.map(record => record.current_price);

      // Calculate the standard deviation
      const stdDeviation = calculateStandardDeviation(prices);

      // Send the response
      res.status(200).json({ coin, standardDeviation: stdDeviation });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


startApp();
