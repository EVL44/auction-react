import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style.css";
import "./ProductCard.css";
import Header from "./Header";
import axios from "axios";
import { Button } from "react-bootstrap";

function ProductCard() {
  let user = JSON.parse(localStorage.getItem("user-info"));
  const { pid } = useParams();
  const [data, setData] = useState({});
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIncrement, setSelectedIncrement] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [expiredMessage, setExpiredMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetch(`http://localhost:8000/api/product/${pid}`);
        if (!result.ok) {
          throw new Error("Ha Howa Erreur");
        }
        result = await result.json();
        setData(result);
        setPrice(result.price);

        const expirationTime = new Date(result.expiration_time).getTime();

        const updateRemainingTime = () => {
          const now = new Date().getTime();
          const distance = expirationTime - now;

          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            if (distance < 60000) {
              // If less than a minute left
              document.getElementById("remaining-time").style.color = "red"; // Change color to red
            }
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
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [pid]);

  useEffect(() => {
    const isAuctionExpired = localStorage.getItem("auctionExpired");
    if (isAuctionExpired === "true") {
      setExpiredMessage("This auction has ended");
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/${data.user_id}`
        );
        setUserDetails(response.data);
        console.warn(userDetails, userDetails.avatar);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    if (data.user_id) {
      fetchUserDetails();
    }
  }, [data.user_id]);

  async function auction() {
    try {
      const increment = parseFloat(selectedIncrement);
      if (isNaN(increment)) {
        console.error("Invalid increment:", selectedIncrement);
        return;
      }
      const currentPrice = parseFloat(price);
      if (isNaN(currentPrice)) {
        console.error("Invalid price:", price);
        return;
      }
      const updatedPrice = currentPrice + increment;

      if (user && user.id === data.user_id) {
        setErrorMessage("You cannot auction your own product");
        return;
      }

      const response = await axios.put(
        `http://localhost:8000/api/update/${pid}`,
        {
          price: updatedPrice.toString(),
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setPrice(updatedPrice.toString());
      } else {
        console.log("Unexpected status:", response.status);
      }
    } catch (error) {
      console.error("Error updating price:", error.message);
    }
  }

  function handleIncrementChange(event) {
    setSelectedIncrement(event.target.value);
  }

  return (
    <div>
      <Header />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="product-container">
        <div className="product-image">
          <img
            className="img"
            src={`http://localhost:8000/${data.file_path}`}
            alt={data.name}
          />
        </div>
        <div className="product-details">
          <div className="user-info">
            {userDetails && userDetails.avatar ? (
              <img className="user-avatar" style={{ width: 45, height: 45 }} src={`http://localhost:8000/${userDetails.avatar}`} alt="Avatar" />
            ) : (
              <img
                className="user-avatar"
                style={{ width: 45, height: 45 }}
                src="/unknown.jpg" 
              />
            )}
            <h2 className="font-c user-name">
              {userDetails ? userDetails.name : "..."}
            </h2>
          </div>
          <h1 className="product-title">{data.name}</h1>
          <p className="product-description">{data.description}</p>
          <div className="product-price">
            <span className="product-price-label">Price : </span>
            <span className="product-price-value">${price}</span>
          </div>
          <div className="product-time">
            <span className="product-time-label">Time Left : </span>
            <span className="product-time-value" id="remaining-time">
              {remainingTime}
            </span>
          </div>
          {expiredMessage && <p className="red-text">{expiredMessage}</p>}
          {!expiredMessage && (
            <>
              <input
                type="number"
                value={selectedIncrement}
                onChange={handleIncrementChange}
                placeholder="Enter increment amount"
                className="form-control"
              />
              {user && user.id === data.user_id ? (
                <button className="product-button" disabled>
                  Buy Now
                </button>
              ) : (
                <button onClick={auction} className="product-button">
                  Buy Now
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
