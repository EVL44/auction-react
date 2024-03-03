
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Header from './Header';

function ShowProducts({ searchKey }) {
  const [data, setData] = useState([]);

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

  if (!searchKey || searchKey.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="d-flex flex-column align-items-center font-a">
        <h1>Results</h1> <br />
        <div className="col-sm-8 off-sm-2">
          <Table bordered>
            <thead>
              <tr style={{ height: 50 }}>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img style={{ width: 100, height: 100 }} src={`http://localhost:8000/${item.file_path}`} alt={item.name} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price} $</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <br /> <br />
      </div>
    </div>
  );
}

export default ShowProducts;
