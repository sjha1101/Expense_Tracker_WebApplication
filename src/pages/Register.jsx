import React, { useState } from "react";
import img from "../images/Accountant.gif";
import "../css/login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://expense-tracker-webapplication.onrender.com/";
// Render backend URL
// const API_URL = "http://127.0.0.1:5000"; // Use this for local testing

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!username || !password || !confirmPassword) {
            setError("Please fill all fields!");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/register`, { username, password });
            alert(res.data.message || "User registered successfully!");
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            navigate("/login");
        } catch (err) {
            console.error("Register Error:", err); // Detailed error in browser console
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Something went wrong! Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setError("");
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-form">
                    <h1>Sign Up</h1>
                    {error && <p className="error-msg">{error}</p>}
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="login-input"
                        />
                        <div className="button-group">
                            <button type="submit" className="btn-login" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </button>
                            <button type="button" onClick={handleReset} className="btn-reset">
                                Reset
                            </button>
                        </div>
                        <div className="linkform">
                            <p>
                                Already have an account? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="login-image">
                    <img src={img} alt="Register GIF" />
                </div>
            </div>
        </div>
    );
}

export default Register;
