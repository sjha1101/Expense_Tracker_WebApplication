import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseShow from "./expenseshow";
import { Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from "chart.js";
import "../css/home.css";

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Expensehistory() {
    const [expenses, setExpenses] = useState([]);
    const [editingExpense, setEditingExpense] = useState(null);

    // Fetch expenses when component mounts
    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        axios.get(`http://127.0.0.1:5000/expenses?user_id=${user.id}`)
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const deleteExpense = (id) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        axios.delete(`http://127.0.0.1:5000/expenses/${id}?user_id=${user.id}`)
            .then(res => {
                alert(res.data.message);
                fetchExpenses();
            })
            .catch(err => console.error(err));
    };

    const saveEdit = (updatedExpense) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        axios.put(`http://127.0.0.1:5000/expenses/${updatedExpense.id}`, {
            ...updatedExpense,
            user_id: user.id
        })
            .then(res => {
                alert(res.data.message);
                setEditingExpense(null);
                fetchExpenses();
            })
            .catch(err => console.error(err));
    };

    // Prepare Pie chart data
    const chartData = {
        labels: expenses.map(exp => exp.item),
        datasets: [
            {
                label: "Expense Amount",
                data: expenses.map(exp => parseFloat(exp.amount)), // ensure numbers
                backgroundColor: [
                    "#6d28d9",
                    "#4f46e5",
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6"
                ],
                borderColor: "#fff",
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" },
            title: { display: true, text: "Expense Distribution" }
        }
    };

    return (
        <>
            <h1 className="expensetitle">Expense History</h1>
            <div className="expenseshow-container">
                <div className="history-layout">
                    {/* Left side list */}
                    <div className="expense-section">
                        <ExpenseShow
                            expenses={expenses}
                            deleteExpense={deleteExpense}
                            setEditingExpense={setEditingExpense}
                        />
                    </div>

                    {/* Right side: Pie chart or edit form */}
                    <div className="graph-section">
                        {editingExpense ? (
                            <div className="edit-form">
                                <h2>Edit Expense</h2>
                                <input
                                    type="text"
                                    value={editingExpense.item}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, item: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={editingExpense.amount}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                                />
                                <input
                                    type="date"
                                    value={editingExpense.date}
                                    onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                />
                                <div className="button-group">
                                    <button className="add-btn" onClick={() => saveEdit(editingExpense)}>Update</button>
                                    <button className="delete-btn" onClick={() => setEditingExpense(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <Pie data={chartData} options={chartOptions} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Expensehistory;
