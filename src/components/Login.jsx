import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navbar from './Navbar';
import './style.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/Home");
        }
    }, []);

    async function login() {
        console.warn(email, password);
        let Item = { email, password };
        console.warn(Item);

        let result = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            body: JSON.stringify(Item),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (result.status === 200) {
            result = await result.json();
            console.warn("result", result);
            localStorage.setItem("user-info", JSON.stringify(result));
            navigate("/Home");
        } else {
            setErrorMessage("Invalid email or password. Please try again.");

            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        }
    }

    return (
        <div>
            <Navbar />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className='custom-cont'>
                <div className="custom-login">
                    <h1 className='font-b mb-5'>Login</h1>

                    <div className="group">
                        <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} className="input mt-3" required/>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className='font-b'>Email</label>
                    </div> <br />

                    <div className="group">
                        <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} className="input mt-5" required/>
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label className='font-b'>Password</label>
                    </div> <br />

                    <Button onClick={login} className="custom-btn mt-5 font-b"> Done </Button> <br />

                </div>
            </div>
        </div>
    );
}

export default Login;
