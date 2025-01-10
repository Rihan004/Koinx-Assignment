A Node.js-based application that tracks cryptocurrency prices, market capitalization, and 24-hour changes for Bitcoin, Ethereum, and Matic. The project fetches data from the CoinGecko API at regular intervals and stores it in a MongoDB database. It also provides APIs to fetch the latest stats and calculate the standard deviation of cryptocurrency prices.


## Features

- **Background Job**: Automatically fetches the latest cryptocurrency data every 2 hours and stores it in a MongoDB database.
- **APIs**:
  - `/stats`: Returns the latest price, market cap, and 24-hour change for a requested cryptocurrency.
  - `/deviation`: Calculates the standard deviation of the price for the last 100 records of a requested cryptocurrency.

---


## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **HTTP Client**: Axios
- **Task Scheduling**: Node-Cron
- **API Source**: [CoinGecko API](https://www.coingecko.com/en/api/documentation)

---

## Prerequisites

1. **Node.js**: Make sure you have Node.js installed on your machine.
2. **MongoDB**: Set up a MongoDB instance locally or use a cloud service like MongoDB Atlas.
3. **API Key**: Obtain a CoinGecko API key.

---

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/crypto-tracker-service.git
   cd crypto-tracker-service
2. npm install
3. Create a .env file in the root directory and add the following environment variables:
   MONGO_URI=your_mongodb_connection_string
   COINGECKO_API_URL=https://api.coingecko.com/api/v3/simple/price
   API_KEY=your_api_key_here


API Endpoints
1. /stats
Fetch the latest stats for a cryptocurrency.

Method: GET
Query Params:
coin (required): The cryptocurrency to fetch (bitcoin, ethereum, or matic-network).
curl "http://localhost:3000/stats?coin=bitcoin"

{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}

2. /deviation
Calculate the standard deviation of the price for the last 100 records.
curl "http://localhost:3000/deviation?coin=bitcoin"


Method: GET
Query Params:
coin (required): The cryptocurrency to fetch (bitcoin, ethereum, or matic-network).
{
  "coin": "bitcoin",
  "standardDeviation": 4082.48
}
