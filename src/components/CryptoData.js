import axios from 'axios';
import moment from 'moment';

const formatSparkline = (numbers) => {
  const sevenDaysAgo = moment().subtract(7, 'days').unix();
  let formattedSparkline = numbers.map((item, index) => {
    return {
      x: sevenDaysAgo + (index + 1) * 3600,
      y: item,
    }
  })

  return formattedSparkline;
}

const formatMarketData = (data) => {
  let formattedData = [];

  data.forEach(item => {
    const formattedSparkline = formatSparkline(item.sparkline_in_7d.price)

    const formattedItem = {
      ...item,
      sparkline_in_7d: {
        price: formattedSparkline
      }
    }

    formattedData.push(formattedItem);
  });

  return formattedData;
}
export const fetchCryptoDataFromCoinGecko = async (activeCryptoSymbols) => {
  try {
      // Convert symbols array to a comma-separated string for CoinGecko's ids param
      const ids = activeCryptoSymbols.join(',');

      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&price_change_percentage=24h&sparkline=false&market_data=true&localization=false`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    

      const data = await response.json();
      // console.log(data);
      return data;
  } catch (error) {
      console.error("Error fetching crypto data from CoinGecko:", error);
  }
};

export const getMarketData = async () => {
  try {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d");
    const data = response.data;
    const formattedResponse = formatMarketData(data); 
    return formattedResponse;
  } catch (error) {
    console.log(error.message);
  }
}