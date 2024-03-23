import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import Navbar from './Navbar';
import './style.css';

function UpdateProduct() {

  const { pid } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetch(`http://localhost:8000/api/product/${pid}`);
        if (!result.ok) {
          throw new Error('Failed to fetch data');
        }
        result = await result.json();
        setData(result);
        setName(result.name);
        setDescription(result.description);
        setPrice(result.price);
        setFile(result.file);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [pid]);

  async function update() {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);

    console.log(formData);

    const response = await axios.post('http://localhost:8000/api/update/' + pid + '?_method=PUT', formData);

    if (response.status === 200) {
      console.log(response.data.message);
      navigate('/MyProducts');
    } else {
      console.log('Unexpected status:', response.status);
    }

  }

  return (
    <div>
      <Navbar />
      <div className="custom-cont">
        <div className="custom-login">
          <h1 className="font-b mb-4">Update Product</h1>

          <Form>
            <input type="text" onChange={(e) => setName(e.target.value)} defaultValue={data.name} placeholder="Name" className="form-control mb-2 " /> <br />
            <input type="number" onChange={(e) => setPrice(e.target.value)} defaultValue={data.price} placeholder="Price" className="form-control mb-3 " /> <br />
            <textarea onChange={(e) => setDescription(e.target.value)} defaultValue={data.description} placeholder="Description" className="form-control mb-3"  rows="4" /><br />
            <img style={{  height: 100 }} src={"http://localhost:8000/" + data.file_path} /> <br />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} defaultValue={data.file_path} className="mb-3 form-control custom-placeholder" /> <br />

            <Button onClick={update} className="custom-btn"> Done </Button><br /> <br /> <br />  <br /> <br />
          </Form>

        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
