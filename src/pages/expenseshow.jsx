import React from "react";
import "../assets/css/home.css";

function ExpenseShow({ expenses, deleteExpense, setEditingExpense }) {
    return (
        <div>
            {expenses.length === 0 ? (
                <div className="empty-state">No expenses yet</div>
            ) : (
                <ul className="expense-list">
                    {expenses.map((exp) => (
                        <li key={exp.id} className="expense-item">
                            <div className="expense-info">
                                <span className="expense-title">Item Name: {exp.item}</span>
                                <span className="expense-amount">Price: ₹{exp.amount}</span>
                                <span className="expense-date">Date of expense: {exp.date}</span>
                            </div>
                            <div className="action-buttons">
                                <button className="edit-btn" onClick={() => setEditingExpense(exp)}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteExpense(exp.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ExpenseShow;
