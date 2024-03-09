import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./Navbar.css";

function Navbar() {

  const [avatar, setAvatar] = useState("");
  const [avatarLoaded, setAvatarLoaded] = useState(false); 

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      const fetchData = async () => {
        try {
          let result = await fetch(`http://localhost:8000/api/user/${user.id}`);
          if (!result.ok) {
            throw new Error("Failed to fetch data");
          }
          result = await result.json();
          setAvatar(result.avatar);
          setAvatarLoaded(true); 
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [user.id]);

  return (
    <div className="navbar">
      <h3> Simo </h3>
      <ul>
        <li>Home</li>
        <li>Products</li>
        <li>About</li>
      </ul>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <AiOutlineSearch />
      </div>

      {avatarLoaded ? (
        <img
          src={"http://localhost:8000/" + avatar}
          style={{ width: 35, height: 35 }}
          alt="User Avatar"
          className="avatar"
        />
      ) : (
        <div className="avatar-placeholder"></div> 
      )}
    </div>
  );
}
export default Navbar;
