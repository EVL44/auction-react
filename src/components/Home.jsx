import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";
import Loading from "./Loading"; 
import './Home.css';

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [topAuctions, setTopAuctions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopAuctions();
  }, []);

  async function fetchTopAuctions() {
    try {
      let result = await fetch('http://localhost:8000/api/top-auctions');
      result = await result.json();
      const auctionsArray = Object.values(result);
      setTopAuctions(auctionsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top auctions:', error);
      setLoading(false); 
    }
  }

  function handleProductClick(product) {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  };

  return (
    <div>
      <Navbar />
      <div>
        {loading ? ( 
          <Loading />
        ) : (
          <div className="rh">
            <div className="product-container font-b mt-5 mb-4">
              {topAuctions.map((item) => 
                <Card className="Card" key={item.id} style={{ width: '18rem' }} onClick={() => handleProductClick(item)}>
                  <Card.Img style={{height: 150}} variant="top" src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}</Card.Title>
                    <Card.Text> {item.price} MAD</Card.Text>
                    <Button className="getnow-btn">get it now</Button>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
      {selectedProduct && <ProductCard product={selectedProduct} />}
    </div>
  );
}

export default Home;
