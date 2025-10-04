import React, { useState } from "react";
import img from "../images/Accountant.gif";
import "../css/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const API_URL = "https://expense-tracker-webapplication.onrender.com";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill all fields!");
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setError(res.data.message);

            navigate("/");
        } catch (err) {
            if (err.response && err.response.data.error) {
                setError(err.response.data.error); // 🔹 show backend error in UI
            } else {
                setError("Something went wrong! Please try again.");
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
                            <p>
                                Don't have an account? <Link to="/register">Sign Up</Link>
                            </p>
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
