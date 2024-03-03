import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import MyProducts from './components/MyProducts';
import Home from './components/Home';
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import Search from './components/Search';
import SearchResults from './components/SearchResults';
import ProductCard from './components/ProductCard';
import './App.css';
import AvatarUpload from './components/AvatarUpload';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/ProductCard/:pid" element={<ProductCard />} />
          <Route path='/' element={<Home />} />
          <Route path='/auction-react' element={<Home />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/MyProducts' element={<MyProducts/>} />
          <Route path='/Search' element={<Search/>} />
          <Route path='/AddProduct' element={ <AddProduct/> } />
          <Route path='/UpdateProduct/:pid' element={ <UpdateProduct/> } />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/search-results' element={<SearchResults />} />
          <Route path='/avatarUpload' element={<AvatarUpload />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
