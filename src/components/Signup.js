import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import host from "../host"

const Signup = (props) => {
    const [credential, setcredential] = useState({ username: "", email: "", password: "", cpassword: "" });
    const onChange = (e) => {
        setcredential({ ...credential, [e.target.name]: e.target.value });
    }
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credential.password !== credential.cpassword) {
            alert("The confirm password field must match the password you entered.");
        }
        else {
            //API Call
            try {
                const response = await fetch(`${host}/api/auth/createuser`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({ username: credential.username, email: credential.email, password: credential.password })
                });
                const json = await response.json();
                if (response.ok) {
                    //Save the auth token and redirect
                    localStorage.setItem('token', json.authToken);
                    console.log("Account created successfully", localStorage.getItem('token'))
                    navigate("/");
                    window.location.reload();
                }
                else {
                    // Error handling
                    if (json.errors) {
                        // Validation errors
                        const errorMessages = json.errors.map(error => error.msg).join('\n');
                        alert(`${errorMessages}`);
                    } else {
                        // Other errors
                        alert(`${json.error}`);
                    }
                }
            }
            catch (error) {
                console.error("An unexpected error occurred:", error);
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    return (
        <div>
            <div className='login-container'>
                <div className='card card-login p-4'>
                    <div className='login-header'>Sign Up</div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="text" className="form-control" id="username" name='username' placeholder='Username' onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" id="email" name='email' placeholder='Email' autoComplete="username" onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" autoComplete="new-password" onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" id="cpassword" name="cpassword" placeholder='Confirm Password' autoComplete="new-password" onChange={onChange} />
                        </div>
                        <button type="submit" className="btn btn-primary">SignUp</button>
                        <p className='my-2'>Already have ProjectBuddy account <Link to="/Login" >Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup