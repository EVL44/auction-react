import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import { FaPlus } from "react-icons/fa";
import "./MyProducts.css";
import Navbar from './Navbar';
import Loading from './Loading';

function MyProducts() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        let user = JSON.parse(localStorage.getItem('user-info'));
        if (!user) {
          return;
        }
        let result = await fetch('http://localhost:8000/api/user/' + user.id + '/products');
        result = await result.json();
        setData(result);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  async function deleteOperation(pid) {
    try {
      let result = await fetch('http://localhost:8000/api/delete/' + pid, {
        method: 'DELETE'
      });
      result = await result.json();
      getData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  async function getData() {
    try {
      let user = JSON.parse(localStorage.getItem('user-info'));
      if (!user) {
        return;
      }
      let result = await fetch('http://localhost:8000/api/user/' + user.id + '/products');
      result = await result.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('user-info')) {
      navigate("/Home");
    }
  }, []);

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
      <div className='bggg'>
        <h1 className='title22'> Product List </h1>  <br />
        <div className=' col-sm-10 off-sm-2 '>
          <Button className='custom-add' as={Link} to="/AddProduct" > <FaPlus /> Add Product </Button>
          
            <Table className='ttt'>
              <thead>
                <tr style={{ height: 20 }} >
                </tr>
              </thead>
              <tbody>
                {data.map((item) =>
                  <tr key={item.pid} className='rowww'>
                    <td><img className='shwimg'  onClick={() => handleProductClick(item)} src={ item.file_path} alt={item.name} /></td>
                    <td>{item.name.length > 35 ? `${item.name.substring(0, 35)}...` : item.name}</td>
                    <td className='prc'>{item.price} MAD</td>
                    <td className='ops'>
                      <Button as={Link} to={"/UpdateProduct/" + item.pid} className='custom-update'>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button onClick={() => deleteOperation(item.pid)} className='custom-delete'>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr style={{ height: 20 }} >
                </tr>
              </tfoot>
            </Table>
          
        </div>
        <br /> <br />
      </div>
      )}
      {selectedProduct && <ProductCard product={selectedProduct} />}
    </div>
  );
}

export default MyProducts;
