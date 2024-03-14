import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Search() {
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search-results?key=${key}`);
  }

  return (
    <> 
      <Navbar/>

      <Form onSubmit={handleSearch} className="d-flex align-items-center custom-search font-c">
        <FormControl
          type="search"
          placeholder="Search"
          className="custom-placeholder py-1 bg-black text-light"
          aria-label="Search"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button variant="outline-success" type="submit">
          <AiOutlineSearch />
        </Button>
      </Form>
    </>
   
  );
}

export default Search;
