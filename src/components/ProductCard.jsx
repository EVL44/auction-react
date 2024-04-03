import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Alert  } from 'react-bootstrap';
import { FaRegBookmark ,FaBookmark, FaCreditCard } from "react-icons/fa";
import "./style.css";
import "./ProductCard.css";
import Navbar from "./Navbar";
import axios from "axios";
import Loading from "./Loading";

function ProductCard() {
  let user = JSON.parse(localStorage.getItem("user-info"));
  const { pid } = useParams();
  const [data, setData] = useState({});
  const [price, setPrice] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedIncrement, setSelectedIncrement] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [expiredMessage, setExpiredMessage] = useState("");
  const [expired, setExpired] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [save, setSave] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let result = await fetch(`http://localhost:8000/api/product/${pid}`);
        if (!result.ok) {
          throw new Error("Ha Howa Erreur");
        }
        result = await result.json();
        setData(result);
        setPrice(result.price);
        setBuyerId(result.buyer_id);

        if (result.buyer_id) {
          let response = await fetch(`http://localhost:8000/api/user/${result.buyer_id}`);
          response = await  response.json();
          setBuyerDetails(response);
        } 

        function updateRemainingTime() {
          const now = new Date().getTime();
          const expirationTime = new Date(result.expiration_time).getTime(); 
          const distance = expirationTime - now;
          
          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          
            setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            if (distance < 60000) {
              document.getElementById("remaining-time").style.color = "red";
            }
          } else {
            setRemainingTime(null);
            setExpired(true);
            setExpiredMessage("This auction has ended. The winner is : " );
          }
        }

        updateRemainingTime();
        const timerId = setInterval(updateRemainingTime, 1000);
  
        return () => clearInterval(timerId); 
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
  
    fetchData()
      .then(() => setLoading(false))
      .catch(() => setLoading(false));

  }, [pid]);
  

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/user/${data.user_id}`
        );
        setUserDetails(response.data);
        setUserLoading(false); 
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    }

    if (data.user_id) {
      fetchUserDetails();
    }
  }, [data.user_id]);

  useEffect(() => {
    async function checkWishList() {
      const response = await axios.get(`http://localhost:8000/api/getproducts/${user.id}`);
      const userWishlist = response.data;
      const isInWishList = userWishlist.includes(pid);
      
      if (isInWishList) {
        setSave(true); 
      }
    }
    
    checkWishList();
  }, []);

  function auction() {
    if( user.id === parseInt(data.user_id)) {
      setErrorMessage("You cannot auction your own product");
    } else {
      if( user.id === parseInt(data.buyer_id) ) {
        setErrorMessage("You already auction on this item!");
      } else {
        makeAuction();
      }
    }
  }

  async function makeAuction() {
    const increment = parseFloat(selectedIncrement);
    if( increment > 0 || isNaN(increment)) {
      const currentPrice = parseFloat(price);
      const updatedPrice = currentPrice + increment;
      const updatedBuyer = user.id;
      const response = await axios.put( `http://localhost:8000/api/update/${pid}`, {
          price: updatedPrice.toString(),
          buyer_id: updatedBuyer,
        }
      );

      if (response.status === 200) { 
        window.location.reload();
        setPrice(updatedPrice.toString());
      } 
    }  else{
      setErrorMessage("Invalid Increment");
    }
  }

  async function addToWishList() {
    try {
      const response = await axios.get(`http://localhost:8000/api/getproducts/${user.id}`);
      const userWishlist = response.data;
      const isInWishList = userWishlist.includes(pid);
  
      if (isInWishList) {
        await axios.delete(`http://localhost:8000/api/remove-from-wishlist/${user.id}/${pid}`);
        setSave(false); 
      } else {
        await axios.post(`http://localhost:8000/api/wish`, {
          user_id: user.id,
          product_id: pid
        });
        setSave(true); 
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error.message);
    }
  }
  
  

  function handleIncrementChange(event) {
    setSelectedIncrement(event.target.value);
  }

  return (
    <div>
      <Navbar />
      {loading || userLoading ? (
        <Loading />
      ) : (
        <div className="all">
          {errorMessage && <Alert variant="danger"> {errorMessage} </Alert> }
          <div className="user-info">
            {userDetails && userDetails.avatar ? (
              <img className="user-avatar" style={{ width: 45, height: 45 }} src={`http://localhost:8000/${userDetails.avatar}`} alt="Avatar" />
            ) : (
              <img className="user-avatar" style={{ width: 45, height: 45 }}  src="/unknown.jpg"  />
            )}
            <h2 className="font-a user-name"> {userDetails ? userDetails.name : ""} </h2>
          </div>
          <h1 className="product-title font-b">{data.name}</h1>
          
          <div className="product-container1">
            <div className="product-image">
              <img
                className="img"
                src={`http://localhost:8000/${data.file_path}`}
                alt={data.name}
              />
            </div>
            <div className="product-details">
              
              <div className="product-price font-c">
                <span className="product-price-label">Price : </span>
                <span className="product-price-value">${price}</span>
              </div>
              
              
              {!expired ? (
                <div className="porduct-make">
                  <div className="product-time font-c">
                    <span className="product-time-label">Time Left : </span>
                    <span className="product-time-value" id="remaining-time">  {remainingTime} </span>
                  </div>
                  <div className="make-offer">
                    <h2 className="font-b">Current buyer is : {buyerDetails ? buyerDetails.name : "Unknown"}</h2>
                    {errorMessage && <Alert variant="danger"> {errorMessage}</Alert> }
                    <input type="number" value={selectedIncrement} onChange={handleIncrementChange} placeholder="Enter increment amount" className="form-control incr-pay"/>
                    <button onClick={auction} className="product-button font-b"> <FaCreditCard />  Place a Bit </button>
                    <button onClick={addToWishList} className="product-button font-b">{save ? <FaBookmark/> : <FaRegBookmark/>}  Wish List </button>
                  </div>
                </div>
              ) : (
                <>
                  {expiredMessage && <Alert variant="danger"> {expiredMessage}  {buyerDetails ? buyerDetails.name : "Unknown"}  </Alert> }
                </>
              )}

            </div>
          </div>
          <h1 className="product-title font-b">Description</h1>
          <p className="product-description font-c">{data.description}</p>
          <br /><br /><br /><br /><br />
        </div>
      )}
    </div>
  );
}

export default ProductCard;
