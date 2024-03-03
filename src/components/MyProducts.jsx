import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Header from './Header';

function MyProducts() {

  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      getData();
    };

    fetchData();
  }, []);

  async function deleteOperation(pid) {
    let result = await fetch('http://localhost:8000/api/delete/' + pid, {
      method: 'DELETE'
    });

    result = await result.json();
    getData();
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
      <div className='d-flex flex-column align-items-center font-a'>
        <h1> Product List </h1>  <br />
        <div className=' col-sm-8 off-sm-2 '>
          <Button className='custom-add' as={Link} to="/AddProduct" >Add Product</Button> <br /> <br /> <br />
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
              {
                data.map((item) =>
                  <tr>
                    <td> <img style={{ width: 100, height: 100 }} src={"http://localhost:8000/" + item.file_path} /> </td>
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
                )
              }
            </tbody>
          </Table>
        </div>
        <br /> <br />
      </div>
    </div>
  );
}

export default MyProducts;
