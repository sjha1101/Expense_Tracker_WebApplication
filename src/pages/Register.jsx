import React, { useState } from "react";
import img from "../images/Accountant.gif";
import "../css/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            alert("Please fill all fields!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // ✅ Call Flask Register API
            const res = await axios.post("http://127.0.0.1:5000/register", {
                username,
                password
            });

            alert(res.data.message || "User registered successfully!");
            setUsername("");
            setPassword("");
            setConfirmPassword("");

            // ✅ Redirect to login page
            navigate("/login");

        } catch (err) {
            if (err.response && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                alert("Something went wrong!");
            }
        }
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <div className="login-page">
            <div className="login-container">

                <div className="login-form">
                    <h1>Sign Up</h1>
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
                            placeholder="Enter confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="login-input"
                        />
                        <div className="button-group">
                            <button type="submit" className="btn-login">Register</button>
                            <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
                        </div>
                        <div className="linkform">
                            <p>Already have an account ? <a href="/login">Login</a></p>
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
