import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './style.css';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('user-info')) {
            navigate("/Home");
        }
    }, []);

    async function signup() {
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!/^\w+$/.test(name)) {
            setError("Username must be a single word without spaces.");
            return;
        }

        // Check email availability
        let emailCheck = await fetch('http://localhost:8000/api/checkEmail', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        emailCheck = await emailCheck.json();
        if (emailCheck.exists) {
            setError("Email is already in use.");
            return;
        }

        // Check username availability
        let usernameCheck = await fetch('http://localhost:8000/api/checkUsername', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });
        usernameCheck = await usernameCheck.json();
        if (usernameCheck.exists) {
            setError("Username is already in use.");
            return;
        }


        let newUser = { name, email, password };
        console.warn("newUser", newUser);

        let result = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        result = await result.json();
        console.warn("result", result);

        localStorage.setItem("user-info", JSON.stringify(result));

        navigate("/Home");
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    return (
        <div>
            <Navbar />
            {error && <div className="error-message">{error}</div>}
            <div className='custom-cont'>
                <div className="custom-signup">
                    <h1 className='mb-5 font-b'>Get Started</h1>

                    <div className="group">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input mt-3" required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className='font-b'>Username</label>
                    </div> <br />

                    <div className="group">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-3" required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className='font-b'>Email</label>
                    </div> <br />

                    <div className="group">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-3" required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className='font-b'>Password</label>
                    </div> <br />

                    <div className="group">
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input mt-3" required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label className='font-b'>Confirm Password</label>
                    </div> <br />

                    <Button onClick={signup} className="custom-btn mt-5 mb-5 font-b"> Sign Up </Button> <br /> <br /> <br />
                </div>

                <img src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' className="custom-sideimg" fluid />
            </div>
        </div>

    );
}

export default Register;
