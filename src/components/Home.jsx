import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { useNavigate, Link } from 'react-router-dom';

import Header from './Header';
import ProductCard from './ProductCard'; // Import the ProductCard component
import './style.css'; 

function Home() {
  const [newestProducts, setNewestProducts] = useState([]);
  const [mostExpensiveProducts, setMostExpensiveProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewestProducts();
    fetchMostExpensiveProducts();
  }, []);

  const fetchNewestProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/newest-products');
      const data = await response.json();
      setNewestProducts(data);
    } catch (error) {
      console.error('Error fetching newest products:', error);
    }
  };

  const fetchMostExpensiveProducts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/most-expensive-products');
      const data = await response.json();
      setMostExpensiveProducts(data);
    } catch (error) {
      console.error('Error fetching most expensive products:', error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  };

  return (
    <div>
      <Header/>
      <div>
        <h1 className='font-b'>Welcome to our Store!</h1>
        <h2 className='font-b'>Newest Products</h2>
        <div className="product-container">
          {newestProducts.map(item => (
            <div key={item.id} className="product-card" onClick={() => handleProductClick(item)}>
              <img style={{ width: 100, height: 100 }} src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
          ))}
        </div>
        <h2 className='font-b'>Most Expensive Products</h2>
        <div className="product-container">
          {mostExpensiveProducts.map(product => (
            <div  key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
              <img style={{ width: 100, height: 100 }} src={`http://localhost:8000/${product.file_path}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct  && <ProductCard product={selectedProduct} />} 
      <Footer/>
    </div>
  );
}

export default Home;
