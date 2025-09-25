import React, { useState } from "react";
import img from "../assets/images/Accountant.gif";
import "../assets/css/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); // <-- useNavigate hook

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please fill all fields!");
            return;
        }

        try {
            // Call Flask API
            const res = await axios.post("http://127.0.0.1:5000/login", {
                username,
                password
            });

            alert(res.data.message);  // e.g., "Login successful!"

            // Save user info in localStorage for session
            localStorage.setItem("user", JSON.stringify(res.data.user));

            // Navigate to Home page
            navigate("/"); // <-- correct way
        } catch (err) {
            if (err.response && err.response.data.error) {
                alert(err.response.data.error); // Backend error
            } else {
                alert("Something went wrong!");
            }
        }
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-form">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        <div className="button-group">
                            <button type="submit" className="btn-login">Login</button>
                            <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
                        </div>
                        <div className="linkform">
                            <p>Don't have an account? <a href="./register">Sign Up</a></p>
                        </div>
                    </form>
                </div>

                <div className="login-image">
                    <img src={img} alt="Login GIF" />
                </div>

            </div>
        </div>
    );
}

export default Login;
