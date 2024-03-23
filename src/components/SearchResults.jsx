import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Loading from './Loading';


function SearchResults() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const searchKey = searchParams.get('key');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (searchKey) {
        try {
          const response1 = await fetch(`http://localhost:8000/api/search/${searchKey}`);
          const response2 = await fetch(`http://localhost:8000/api/usersearch/${searchKey}`);
          const result1 = await response1.json();
          const result2 = await response2.json();
          
          setProducts(result1);
          setUsers(result2);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }

    fetchData();
  }, [searchKey]);

  function handleProductClick(product) {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  }

  if (!searchKey || searchKey.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <Navbar />
      {loading ? ( // Display loading indicator if loading is true
            <Loading />
          ) : (
      <div className="d-flex flex-column align-items-center font-a">
        <h1>Results</h1> <br />
        <div className="col-sm-8 off-sm-2">
          <Table bordered >
            <tr style={{ height: 50 }}>
              
            </tr>
            {products.map((item) => (
              <tr key={item.id} onClick={() => handleProductClick(item)}>
                <td>
                  <img style={{ height: 100 }} src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.price} $</td>
              </tr>
            ))}
          </Table>
          <Table bordered className="col-sm-6 off-sm-3" >
            <tr style={{ height: 50 }}>
              
            </tr>
            {users.map((user) => (
              <tr key={user.id} onClick={() => handleProductClick(item)}>
                <td>
                  <img  style={{ borderRadius: 50 , height: 100 }} src={`http://localhost:8000/${user.avatar}`} alt={user.name} />
                </td>
                <td>{user.name}</td>
              </tr>
            ))}
          </Table>
        </div>
        <br /> <br />
      </div>
      )}
    </div>
  );
}

export default SearchResults;
