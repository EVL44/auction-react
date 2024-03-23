import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  let user = JSON.parse(localStorage.getItem("user-info"));
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const navRef = useRef();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [key, setKey] = useState('');

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      const fetchData = async () => {
        let result = await fetch(`http://localhost:8000/api/user/${user.id}`);
        if (!result.ok) {
          throw new Error("Failed to fetch data");
        }
        result = await result.json();
        setAvatar(result.avatar);
        setAvatarLoaded(true);
      };
      fetchData();
    }
  }, []); // Corrected dependency array

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/search-results?key=${key}`);
  }

  function ShowNavbar() {
    navRef.current.classList.toggle("responsive_nav");
  }

  return (
    <div className="navbar font-b">
      <h3 className="logo" as={Link} to="/Home"> Logo </h3>
      <nav className="cont" ref={navRef} >
        <ul>
          <li><Link to='/Home' className="links">Home</Link></li>
          <li><Link to='/MyProducts' className="links">Products</Link></li>
          <li><Link to='/WishList' className="links">Wish List</Link></li>
          
          <li className="search"><Link to='/Search' className="links">Search</Link></li>
          {!localStorage.getItem("user-info") ? (
            <>
              <li><Link to='/Login' className="links">Login</Link></li>
              <li><Link to='/Register' className="links">Signup</Link></li>
            </>
              
          ) : (
          <li className="profile"><Link to='/profile' className="links">Profile</Link></li>
          )}
        </ul>

        <div className="search-avatar">
          <Form className="search-box" onSubmit={handleSearch}>
            <input type="search" placeholder="Search" onChange={(e) => setKey(e.target.value)} />
            <AiOutlineSearch className="search-icon" />
          </Form>

          {localStorage.getItem("user-info") && avatarLoaded && (
            <div className="avatar-container">
              <Link to="/profile" className="links">
                {avatar ? (
                  <img src={`http://localhost:8000/${avatar}`} alt="User Avatar" className="your-avatar" />
                ) : (
                  <img src="/public/unknown.jpg" alt="Unknown Avatar" className="your-avatar" />
                )}
              </Link>
            </div>
          )}

          
        </div>
        

        <button className="nav-btn nav-close-btn" onClick={ShowNavbar}> <FaTimes/> </button>
      </nav>
      <button className="nav-btn" onClick={ShowNavbar}> <FaBars/> </button>
    </div>
  );
}

export default Navbar;
