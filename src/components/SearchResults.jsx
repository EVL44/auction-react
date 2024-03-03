import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';

function SearchResults() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const searchKey = searchParams.get('key');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (searchKey) {
        try {
          const response = await fetch(`http://localhost:8000/api/search/${searchKey}`);
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    }

    fetchData();
  }, [searchKey]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  };

  if (!searchKey || searchKey.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <Header />
      <div className="d-flex flex-column align-items-center font-a">
        <h1>Results</h1> <br />
        <div className="col-sm-8 off-sm-2">
          <Table bordered >
            <tr style={{ height: 50 }}>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
            {data.map((item) => (
              <tr key={item.id} onClick={() => handleProductClick(item)}>
                <td>
                  <img style={{ width: 100, height: 100 }} src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.price} $</td>
              </tr>
            ))}
          </Table>
        </div>
        <br /> <br />
      </div>
    </div>
  );
}

export default SearchResults;
