import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = (props) => {
    const [credential, setcredential] = useState({ email: "", password: "" });
    const onChange = (e) => {
        setcredential({ ...credential, [e.target.name]: e.target.value });
    }
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        //API Call
        try {
            const respone = await fetch(`http://localhost:5000/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ email: credential.email, password: credential.password })
            });
            const json = await respone.json();
            if (json.success) {
                //Save the auth token and redirect
                localStorage.setItem('token', json.authToken);
                console.log("it is saved in localstorage", localStorage.getItem('token'));
                navigate("/");
                window.location.reload();
            }
            else {
                console.log("Invalid Credentials")
                alert("Invalid Credentials");
            }
        }
        catch (error) {
            console.error("An unexpected error occurred:", error);
            alert("An unexpected error occurred. Please try again later.");
        }

    }
    return (
        <div className='login-container'>
            <div className='card card-login p-4'>
                <div className='login-header'>Login</div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input type="email" className="form-control" value={credential.email} id="email" name='email' autoComplete="username" placeholder="Email" onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <input type="password" className="form-control" value={credential.password} id="password" name='password' autoComplete="current-password" placeholder='Password' onChange={onChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className='my-2'>Don't have ProjectBuddy account <Link to="/Signup" >Sign Up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login