import React, { useEffect, useState } from "react";
import axios from "axios";
import ExpenseShow from "./expenseshow"; // Make sure the path is correct
import "../assets/css/home.css";

function Expensehistory() {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        axios.get("http://127.0.0.1:5000/expenses")
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    };

    const deleteExpense = (id) => {
        axios.delete(`http://127.0.0.1:5000/expenses/${id}`)
            .then(res => {
                alert(res.data.message);
                fetchExpenses();
            })
            .catch(err => console.error(err));
    };

    const editExpense = (exp) => {
        const newItem = prompt("Edit item name:", exp.item);
        const newAmount = prompt("Edit amount:", exp.amount);
        const newDate = prompt("Edit date:", exp.date);

        if (newItem && newAmount && newDate) {
            axios.put(`http://127.0.0.1:5000/expenses/${exp.id}`, {
                item: newItem,
                amount: newAmount,
                date: newDate
            })
                .then(res => {
                    alert(res.data.message);
                    fetchExpenses();
                });
        }
    };

    return (
        <div className="container">
            <h1>Expense History</h1>
            <ExpenseShow
                expenses={expenses}
                editExpense={editExpense}
                deleteExpense={deleteExpense}
            />
        </div>
    );
}

export default Expensehistory;
