import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import ProductCard from "./ProductCard";
import Loading from "./Loading"; 
import "./style.css";

function Home() {
  const [newestProducts, setNewestProducts] = useState([]);
  const [mostExpensiveProducts, setMostExpensiveProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
    fetchMostExpensiveProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/newest-products");
      const data = await response.json();
      setNewestProducts(data);
    } catch (error) {
      console.error("Error fetching newest products:", error);
    }
  };

  const fetchMostExpensiveProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/most-expensive-products"
      );
      const data = await response.json();
      setMostExpensiveProducts(data);
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching most expensive products:", error);
    }
  };

  const handleProductClick = (product) => {
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
            <h1 className="font-b">Welcome to our Store!</h1>
            <h2 className="font-b">For You</h2>

            <div className="product-container font-c">
              {newestProducts.map((item) => (
                <div
                  key={item.id}
                  className="product-card"
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    style={{ height: 100 }}
                    src={`http://localhost:8000/${item.file_path}`}
                    alt={item.name}
                  />
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {selectedProduct && <ProductCard product={selectedProduct} />}
    </div>
  );
}

export default Home;
