import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Navbar from './Navbar';
import './EditProfile.css'; 
import { Button, Modal } from 'react-bootstrap';
import { FaUserEdit, FaLock } from 'react-icons/fa'; // Importing icons

function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(true); // To toggle between edit profile and change password mode

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/${id}`);
        setData(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setPhoneNumber(response.data.phone_number);
        setAddress(response.data.address);
        setAvatar(response.data.avatar);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, [id]);

  async function update() {
    try {
      const response = await axios.put(`http://localhost:8000/api/user/${id}`, { name, email, phone_number, address });

      if (response.status === 200) {
        console.log(response.data.message);
        navigate('/profile');
      } else { console.log('Unexpected status:', response.status); }
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  }

  async function updatePassword() {
    try {
      // Check if confirm password matches the new password
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }

      // Check if old password is the same as in the database
      const responseCheckOldPassword = await axios.post(`http://localhost:8000/api/user/${id}/check-old-password`, {
        old_password: oldPassword
      });

      if (responseCheckOldPassword.status !== 200) {
        setOldPasswordError('Old password is incorrect');
        setShowModal(true);
      
        return;
      } else {
        setOldPasswordError('');
      
      }

      const responseUpdatePassword = await axios.put(`http://localhost:8000/api/user/${id}/update-password`, {
        new_password: newPassword, // Send only the new password to replace the old one
      });

      if (responseUpdatePassword.status === 200) {
        console.log(responseUpdatePassword.data.message);
        setSuccessMessage('Password updated successfully');
        setShowModal(true);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError(null);
      } else {
        console.log('Unexpected status:', responseUpdatePassword.status);
        setError(responseUpdatePassword.data.error);
      }
    } catch (error) {
      console.error('Error updating password:', error.message);
    
    }
  }
  function handleCancel() {
    navigate('/profile');
  }
  function handleCloseModal() {
    setShowModal(false);
  }

  function toggleMode() {
    setEditMode(!editMode);
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="sidebar">
          <img className='Profile-Avatar' src={avatar ? `http://localhost:8000/${avatar}` : '/public/unknown.jpg'} alt="Profile Avatar" />
          <h5 className="Profile-Name font-a">{name}</h5>
          <h6 className="Profile-Email font-a">{email}</h6>
          <br /><br />
          <div className="sidebar-buttons font-b">
            <button className="edit-profile-button" onClick={toggleMode}>
              <FaUserEdit />
              <span>Edit Profile</span>
            </button>
            <button className="edit-profile-button" onClick={toggleMode}>
              <FaLock />
              <span>Change Password</span>
            </button>
          </div>
        </div>
        <div className="content">
          <div className="Profile-Container">
            {editMode ? (
              <>
                <h2 className='font-a Profile-Title '>Edit Profile</h2><br />
                <form className='edit-password'>
                  <div className='Inputs font-b'>
                    <div>
                      <p>Name:</p>
                      <input type="text" id="name" placeholder='Name' className='form-control' value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                      <p>Email:</p>
                      <input type="email" id="email" placeholder='Email' className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <p>Phone Number:</p>
                      <input type="tel" id="phone_number" placeholder='Phone Number' className='form-control' value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                    <div>
                      <p>Address:</p>
                      <input type="text" id="address" placeholder='Address' className='form-control' value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                  </div><br />
                  <Button className='update-btn' onClick={update}>Update Profile</Button>
                  <Button className='cancel-btn' onClick={handleCancel}>Cancel</Button> 
                  {error && <p >{error}</p>}
                </form>
              </>
            ) : (
              <>
                <h2 className='font-a Profile-Title '>Change Password</h2><br />
                <form className='change-password'>
                  <div className='Inputs font-b'>
                    <div>
                      <p>Your Old Password:</p>
                      <input type="password" id="oldPassword" placeholder='Old Password' className='form-control' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                      {oldPasswordError && <p>{oldPasswordError}</p>}
                    </div>
                    <div>
                      <p>New Password:</p>
                      <input type="password" id="newPassword" placeholder='New Password' className='form-control' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div>
                      <p>Confirm New Password:</p>
                      <input type="password" id="confirmPassword" placeholder='Confirm New Password' className='form-control' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                  </div><br />
                  <Button className='update-btn' onClick={updatePassword}>Update Password</Button> 
                  <Button className='cancel-btn' onClick={handleCancel}>Cancel</Button>
                  {error && <p >{error}</p>}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{successMessage ? 'Success' : 'Error'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage ? successMessage : error}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}> Close </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EditProfile;
