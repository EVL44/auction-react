import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "./Search";
import "./style.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  let user = JSON.parse(localStorage.getItem("user-info"));
  const [searchKey, setSearchKey] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarLoaded, setAvatarLoaded] = useState(false); // Track whether avatar is loaded

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
  }); 

  function Logout() {
    localStorage.clear();
    navigate("/Home");
  }

  return (
    <>
      <Navbar
        expand="lg"
        variant="dark"
        className="custom-head"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/Home" className="custom-brand font-a">
            Nox Auction
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarCollapse" />
          <Navbar.Collapse id="navbarCollapse">
            <Search onSearch={setSearchKey} />

            <Nav className="custom-links text-white font-b">
              <Nav.Link
                as={Link}
                to="/Home"
                className="custom-routlinks font-b"
              >
                Home
              </Nav.Link>

              <NavDropdown title={`Categories`} id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to="/category1"
                  className="custom-droproutlinks font-b"
                >
                  {" "}
                  Electronics{" "}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/category1"
                  className="custom-droproutlinks font-b"
                >
                  {" "}
                  Cars{" "}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/category1"
                  className="custom-droproutlinks font-b"
                >
                  {" "}
                  Horses{" "}
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/category2"
                  className="custom-droproutlinks font-b"
                >
                  {" "}
                  Niggas{" "}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  as={Link}
                  to="/all-categories"
                  className="custom-droproutlinks font-b"
                >
                  All Categories
                </NavDropdown.Item>
              </NavDropdown>

              {localStorage.getItem("user-info") ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/MyProducts"
                    className="custom-routlinks mr-3 font-b"
                  >
                    MyProducts
                  </Nav.Link>
                  
                  {avatarLoaded ? (
                    <img
                      src={"http://localhost:8000/" + avatar}
                      style={{ width: 35, height: 35 }}
                      alt="User Avatar"
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder"></div> // Placeholder for avatar
                  )}
                  <NavDropdown
                    title={user && user.name}
                    id="basic-nav-dropdown"
                    className="mr-5 text-white font-b"
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/avatarUpload"
                      className="custom-droproutlinks font-b"
                    >
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={Logout}
                      className="custom-droproutlinks font-b"
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/Login"
                    className="custom-routlinks font-b"
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/Register"
                    className="mr-5 custom-routlinks font-b"
                  >
                    Signup
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
