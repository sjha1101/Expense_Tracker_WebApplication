import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import logoutImg from "../images/logout-icon.png";

function Home() {
    const [item, setItem] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    // ---------------- Logout Function ----------------
    const handleLogout = () => {
        localStorage.removeItem("user"); // remove user data
        alert("Logged out successfully!");
        navigate("/login");
    };

    // ---------------- Save Expense ----------------
    const saveExpense = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("You must login first!");
            navigate("/login");
            return;
        }

        if (!item || !amount || !date) {
            alert("Please fill all fields!");
            return;
        }

        axios.post("http://127.0.0.1:5000/expenses", {
            user_id: user.id,  // send user_id to backend
            item,
            amount,
            date
        })
            .then(res => {
                alert(res.data.message);
                setItem("");
                setAmount("");
                setDate("");
                navigate("/history");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            {/* Logout Button */}
            <div className="logout-container" onClick={handleLogout}>
                <img src={logoutImg} className="logout-icon" alt="logout-icon" />

            </div>

            {/* Add Expense Form */}
            <div className="logout-title">
                <h1 className="title">Add New Expense</h1>
            </div>

            <div className="form-grid">
                <input type="text" placeholder="Item Name" value={item} onChange={e => setItem(e.target.value)} />
            </div>
            <div className="form-grid">
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="form-grid">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="button-group">
                <button className="add-btn" onClick={saveExpense}>Add Expense</button>
            </div>
        </div>
    );
}

export default Home;
