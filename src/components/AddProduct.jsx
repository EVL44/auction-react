import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import Navbar from './Navbar';
import './style.css';

function AddProduct() {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem('user-info'));
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState('');
  const [expirationTime, setExpirationTime] = useState('');

  async function addProduct() {
    const formData = new FormData;
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('user_id', user.id);
    formData.append('expiration_time', expirationTime); 

    await axios.post('http://127.0.0.1:8000/api/addproduct', formData)
      .then(({ data }) => {
        console.log(data.message);
        navigate('/MyProducts')
      }).catch(({ response }) => {
        if (response.status == 442) {
          console.log(response.data.errors);
        } else {
          console.log(response.data.message);
        }
      });
  }

  useEffect(() => {
    if (!localStorage.getItem('user-info')) {
      navigate('/Home');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="custom-cont-addpro">
        <div className="custom-addpro">
          <h1 className="font-b mb-4 tit">Add Product</h1>
          <Form>
            <h4 className='font-b tit'> Title </h4>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Name" className="form-control mb-2 " /> <br />
            <h4 className='font-b tit'> Price </h4>
            <input type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="form-control mb-3 " /> <br />
            <h4 className='font-b tit'> Description </h4>
            <textarea onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="form-control mb-3"  rows="4" /><br />
            <h4 className='font-b tit'> Image </h4>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-3 form-control custom-placeholder" /> <br />
            <h4 className='font-b tit'> End Time </h4>
            <input type="datetime-local" onChange={(e) => setExpirationTime(e.target.value)} className="mb-3 form-control custom-placeholder" /> <br />
            
            <Button onClick={addProduct} className="custom-btn"> Done </Button> 
          </Form>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;