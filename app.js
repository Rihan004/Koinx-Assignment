require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const fetchAndStoreData = require('./services/fetchData');

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

startApp();
