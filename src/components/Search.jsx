import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Table} from 'react-bootstrap'
import Navbar from './Navbar';

function Search() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function searchResults(key) {
    if(key.length > 0) {
      let result = await fetch('http://localhost:8000/api/search/' + key);
      result = await result.json();
      setData(result);
      console.warn(result);
    }
}

  function handleProductClick(product) {
    setSelectedProduct(product);
    navigate("/ProductCard/" + product.pid);
  }


  return (
    <> 
      <Navbar/>
      <h2 className='font-b'>Search for Products</h2>
      <input type="text" className='form-control font-c ' placeholder='Search' onChange={(e)=>searchResults(e.target.value)} />
      {
        <Table bordered className='font-a'>
            <tr style={{ height: 50 }}>
            
            </tr>
            {data.map((item) => (
              <tr key={item.id} onClick={() => handleProductClick(item)}>
                <td>
                  <img style={{  height: 100 }} src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.price} $</td>
                </tr>
            ))}
          </Table>
      }
      
    </>
   
  );
}

export default Search;
