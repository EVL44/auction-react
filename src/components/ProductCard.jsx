import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style.css'; 
import Header from './Header';
import axios from "axios";
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

function ProductCard()  {

  let user = JSON.parse(localStorage.getItem('user-info'));
  const { pid } = useParams();
  const [data, setData] = useState({});
  const [price, setPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIncrement, setSelectedIncrement] = useState(0);
  const [remainingTime, setRemainingTime] = useState('');
  const [expiredMessage, setExpiredMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetch(`http://localhost:8000/api/product/${pid}`);
        if (!result.ok) {
          throw new Error('Ha Howa Erreur');
        }
        result = await result.json();
        setData(result);
        setPrice(result.price);
  
        const expirationTime = new Date(result.expiration_time).getTime();
  
        const updateRemainingTime = () => {
          const now = new Date().getTime();
          const distance = expirationTime - now;
  
          if (distance > 0) {
            const Jour =Math.floor((distance%(1000 * 60 *60 * 24 * 30))/(1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setRemainingTime(`${Jour}j ${hours}h ${minutes}m ${seconds}s`);
          } else {
            setRemainingTime(null); // Set remaining time to null if auction has ended
            setExpiredMessage("This auction has ended");
          }
        };
  
        // Update remaining time every second
        updateRemainingTime();
        const timerId = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(timerId); // Cleanup function to clear the interval
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();

  }, [pid]);
  
  useEffect(() => {
    const isAuctionExpired = localStorage.getItem('auctionExpired');
    if (isAuctionExpired === 'true') {
      setExpiredMessage("This auction has ended");
    }
  }, []);

  async function auction() {
    try {
      const increment = parseFloat(selectedIncrement);
      if (isNaN(increment)) {
        console.error('Invalid increment:', selectedIncrement);
        return;
      }
      const currentPrice = parseFloat(price);
      if (isNaN(currentPrice)) {
        console.error('Invalid price:', price);
        return;
      }
      const updatedPrice = currentPrice + increment;
  
      if (user && user.id === data.user_id) {
        setErrorMessage("You cannot auction your own product");

        return;
      }
  
      const response = await axios.put(`http://localhost:8000/api/update/${pid}`, {
        price: updatedPrice.toString()
      });
  
      if (response.status === 200) {
        console.log(response.data.message);
        setPrice(updatedPrice.toString());
        window.location.reload();
      } else {
        console.log('Unexpected status:', response.status);
      }
    } catch (error) {
      console.error('Error updating price:', error.message);
    }
  }
  
  
  function handleIncrementSelection(increment) {
    setSelectedIncrement(increment);
  }

  return (
    <div>
      <Header />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <h1 className="title font-a">Product card</h1>
      <div className="card mb-5 font-b">
        <div className="card-img">
          <img className="img" src={`http://localhost:8000/${data.file_path}`} alt={data.name} />
        </div>
        <div className="card-title">{data.name}</div>
        <div className="card-subtitle">{data.description}</div>
        <hr className="card-divider" />
        <div className="card-footer">
          <div className="card-price"><span>$</span>{data.price}</div>
        </div>
        <div>{remainingTime && <p>{remainingTime}</p>}</div> 
          <div>{expiredMessage && <p className="red-text">{expiredMessage}</p>}</div>
        {!expiredMessage && (
          <>
            <DropdownButton id="dropdown-basic-button" title="Select Increment">
              <Dropdown.Item onClick={() => handleIncrementSelection(100)}>+100$</Dropdown.Item>
              <Dropdown.Item onClick={() => handleIncrementSelection(200)}>+200$</Dropdown.Item>
            </DropdownButton>
            <Button onClick={auction} className="card-btn">Buy Now</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;