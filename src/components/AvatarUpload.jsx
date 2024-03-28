import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from "axios";
import Header from './Header';

function AvatarUpload() {
    let user = JSON.parse(localStorage.getItem('user-info'));
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    async function handleUpload() {
        const formData = new FormData();
        formData.append('file', avatar);

        try {
            const response = await axios.post(`http://localhost:8000/api/upload-avatar/${user.id}?_method=PUT`, formData);

            console.warn("response is", JSON.stringify(response));
            if (response.status === 200) {
                console.log(response.data.message);
                navigate('/Home');
            } else {
                console.log('Unexpected status:', response.status);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    }

    return (
        <div>
            <Header/>
            <Form>
                <input type="file" onChange={e => setAvatar(e.target.files[0])} className="mb-3 form-control custom-placeholder" />
                <Button onClick={handleUpload} className="custom-btn">Upload</Button>
            </Form>
        </div>
    );
}

export default AvatarUpload;