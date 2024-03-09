import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import "./MyProducts.css";
import Header from './Header';
import Loading from './Loading';

function MyProducts() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
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
        setLoading(false); // Set loading to false after data is fetched
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

  return (
    <div>
      <Header />
      {loading ? ( // Display loading indicator if loading is true
            <Loading />
          ) : (
      <div className='d-flex flex-column align-items-center font-a'>
        <h1> Product List </h1>  <br />
        <div className=' col-sm-8 off-sm-2 '>
          <Button className='custom-add' as={Link} to="/AddProduct" >Add Product</Button>
          <Button className='custom-add' as={Link} to="/AddAuction" >Add Auction</Button> <br /> <br /> <br />
          
            <Table>
              <thead>
                <tr style={{ height: 50 }} >
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) =>
                  <tr key={item.pid}>
                    <td><img style={{ width: 100, height: 100 }} src={"http://localhost:8000/" + item.file_path} alt={item.name} /></td>
                    <td>{item.name}</td>
                    <td>{item.price} $</td>
                    <td>
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
            </Table>
          
        </div>
        <br /> <br />
      </div>
      )}
    </div>
  );
}

export default MyProducts;
