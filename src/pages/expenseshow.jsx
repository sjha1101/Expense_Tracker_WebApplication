import React from "react";
import "../assets/css/home.css"
import Expensehistory from "./Expensehistory";

function ExpenseShow({ expenses, editExpense, deleteExpense }) {
    return (
        <div>
            <h2>All Expenses</h2>
            {expenses.length === 0 ? (
                <div className="empty-state">No expenses yet</div>
            ) : (
                <ul className="expense-list">
                    {expenses.map((exp) => (
                        <li key={exp.id} className="expense-item">
                            <div className="expense-info">
                                <span className="expense-title">{exp.item}</span>
                                <span className="expense-date">{exp.date}</span>
                            </div>
                            <span className="expense-amount">₹{exp.amount}</span>
                            <div className="action-buttons">
                                <button className="edit-btn" onClick={() => editExpense(exp)}>Edit</button>
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
