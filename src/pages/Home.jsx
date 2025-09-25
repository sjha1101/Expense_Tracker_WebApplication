import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/css/home.css";

function Home() {
    const [item, setItem] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const navigate = useNavigate();

    const saveExpense = () => {
        // Check if user is logged in only when clicking "Add Expense"
        const user = localStorage.getItem("user");
        if (!user) {
            alert("You must login first!");
            navigate("/login");
            return;
        }

        if (!item || !amount || !date) {
            alert("Please fill all fields!");
            return;
        }

        axios.post("http://127.0.0.1:5000/expenses", { item, amount, date })
            .then(res => {
                alert(res.data.message);
                setItem("");
                setAmount("");
                setDate("");
                navigate("/history"); // go to history after adding
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            <h1>Add New Expense</h1>
            <div className="form-grid">
                <input type="text" placeholder="Item Name" value={item} onChange={e => setItem(e.target.value)} />
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="button-group">
                <button className="add-btn" onClick={saveExpense}>Add Expense</button>
            </div>
        </div>
    );
}

export default Home;
