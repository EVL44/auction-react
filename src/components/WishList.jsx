import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap'; 
import "./MyProducts.css";
import Navbar from './Navbar';
import Loading from './Loading';

function WishList() {

  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    async function fetchWishlist() {
      let user = JSON.parse(localStorage.getItem('user-info'));
      if (!user) {
        return;
      }
      let result = await fetch('http://localhost:8000/api/getproducts/' + user.id);
      result = await result.json();
      setWishlist(result);
      fetchProducts(result);
    }
  
    fetchWishlist();
  }, []); 
  
  async function fetchProducts(wishlistData) {
    try {
      const productsPromises = wishlistData.map(async productId => {
        let result = await fetch(`http://localhost:8000/api/product/${productId}`);
        if (!result.ok) {
          throw new Error(`Failed to fetch product with ID ${productId}`);
        }
        result = await result.json();
        return result;
      });
  
      const products = await Promise.all(productsPromises);
  
      setData(products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  
 useEffect(() => {
    if (!localStorage.getItem('user-info')) {
      navigate("/Home");
    }
  }, [navigate]);

  function handleProductClick(product) {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  };

  return (
    <div>
      <Navbar />
      {loading ? ( 
        <Loading />
      ) : (
        <div className='d-flex flex-column align-items-center font-a bggg'>
          <h1 className='mt-5 mb-5 title22'> WishList </h1>  <br />
          <div className=' col-sm-8 off-sm-2 '>
            <Table >
              <thead>
                <tr>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.pid} onClick={() => handleProductClick(item)}>
                    <td><img style={{ height: 100 }} src={"http://localhost:8000/" + item.file_path} alt={item.name} /></td>
                    <td>{item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}</td>
                    <td>{item.price} MAD</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <br /> <br />
        </div>
      )}
      {selectedProduct && <ProductCard product={selectedProduct} />}
    </div>
  );
}

export default WishList;
