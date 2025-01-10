const url = 'https://api.coingecko.com/api/v3/coins/bitcoin';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': process.env.API_KEY}
};

fetch(url, options)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then((json) => {
    // Extracting and formatting the required data
    const bitcoinData = {
      price: json.market_data.current_price.usd,
      marketCap: json.market_data.market_cap.usd,
      "24hChange": json.market_data.high_24h.usd,
    };
    console.log(bitcoinData);
  })
  .catch((err) => console.error('Error:', err));