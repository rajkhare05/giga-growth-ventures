import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import '../styles/searchStock.css';
import PriceCard from './PriceCard';

const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

const SearchStock = ({ firstName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [stockName, setStockName] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockDate, setStockDate] = useState(formatDate(''));
  const [stockClosePrice, setStockClosePrice] = useState(0);
  const [stockLowPrice, setStockLowPrice] = useState(0);
  const [stockHighPrice, setStockHighPrice] = useState(0);
  const [isErr, setErr] = useState(false);
  const [stockData, setStockData] = useState({});

  const clickHandler = async (name, symbol) => {
    setStockName(name);
    setStockSymbol(symbol);
    setSearchQuery(name + ' (' + symbol + ')');
    setSearchResults([]);
    await fetchStockPrice(symbol);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
        try {
          const response = await fetch(`${BACKEND_URI}/search?q=${searchQuery}`);
          const data = await response.json();
          setSearchResults(data.bestMatches || []);

        } catch (error) {
          console.error('Error fetching stock data:', error);
        }

    } else {
      setSearchResults([]);
    }
  };

  async function fetchStockPrice(symbol) {
    const res = await fetch(`${BACKEND_URI}/stock/${symbol}`);
    const data = await res.json();
    setStockData(data);
    dateChangeHandler(data, '');
  };

  function dateChangeHandler(data, date) {
    date.length > 0 && setStockDate(date);
    if (data['Time Series (Daily)'] === undefined || data['Time Series (Daily)'][date || stockDate] === undefined) {
      setErr(true);

    } else {
      setStockClosePrice(data['Time Series (Daily)'][date || stockDate]['4. close'])
      setStockLowPrice(data['Time Series (Daily)'][date || stockDate]['3. low'])
      setStockHighPrice(data['Time Series (Daily)'][date || stockDate]['2. high'])
      setErr(false);
    }
  }

  function formatDate(dt) {
    if (dt !== '') return dt;

    let formattedDate = '';
    const d = new Date();
    formattedDate = `${d.getFullYear()}-`;

    if (d.getMonth() <= 9) { 
      formattedDate += '0'; 
    }

    formattedDate += `${d.getMonth() + 1}-${d.getDate() - 1}`;
    return formattedDate;
  };

  const shareToRecipient = (platform) => {
      const subject = `${stockName} Stocks`;
      const body = `${stockName} closed on ${stockClosePrice}.\nHad ${stockHighPrice} highest and ${stockLowPrice} lowest on ${stockDate}`;
      const mailURI = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const whatsappURI = `https://api.whatsapp.com/send?text=${encodeURIComponent(body)}`;
      platform === 'mail' ? window.open(mailURI, '_blank') : window.open(whatsappURI, '_blank');
  };

  useEffect(() => {
      if (searchQuery.trim() === '') {
          setSearchResults([]);
      }
  }, [searchQuery, isErr]);

  return (
    <Container>
      <br />
      <Form onSubmit={ (e) => { submitHandler(e) } }>
        <Form.Group controlId="searchQuery">
          <Form.Label><h1>Welcome, { firstName } </h1></Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Company Name here ..."
            size="lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form.Group>
        <br />
        <input type="date" className="date" value={stockDate} onChange = { (e) => { dateChangeHandler(stockData, e.target.value) } } />
        <Button variant="primary" type="submit" className="search-btn">Search</Button>
      </Form>
      <ListGroup>
        {searchResults.map((result) => (
          <ListGroup.Item key={result['1. symbol']} onClick = { async () => await clickHandler(result['2. name'], result['1. symbol']) }>
            {result['2. name']} ({result['1. symbol']})
          </ListGroup.Item>
        ))}
      </ListGroup>
      <br />
      {
        stockSymbol !== '' ? 
          !isErr ?
            <PriceCard 
              name = { stockName } 
              date = { stockDate } 
              closePrice = { stockClosePrice }
              highPrice = { stockHighPrice }
              lowPrice = { stockLowPrice }
              clickHandler = { shareToRecipient }
            /> 
            : <div className="stock-error">Price not listed not this date</div>
         : ''
      }
    </Container>
  );
};

export default SearchStock;

