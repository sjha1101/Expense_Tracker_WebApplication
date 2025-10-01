from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, hashlib
import os

app = Flask(__name__)
CORS(app)

# ---------- Database Setup ----------
def setup_db():
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    
    # Users table
    c.execute("""CREATE TABLE IF NOT EXISTS users (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  username TEXT UNIQUE,
                  password TEXT)""")
    
    # Expenses table
    c.execute("""CREATE TABLE IF NOT EXISTS expenses (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  user_id INTEGER,
                  item TEXT,
                  amount REAL,
                  date TEXT)""")
    
    conn.commit()
    conn.close()

setup_db()

# ---------- Helpers ----------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- User Routes ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400
    
    try:
        conn = sqlite3.connect("expenses.db")
        c = conn.cursor()
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)",
                  (username, hash_password(password)))
        conn.commit()
        return jsonify({"message": "User registered!"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    finally:
        conn.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=? AND password=?",
              (username, hash_password(password)))
    user = c.fetchone()
    conn.close()
    
    if user:
        return jsonify({
            "message": "Login successful",
            "user": {"id": user[0], "username": user[1]}
        })
    return jsonify({"error": "Invalid username or password"}), 401

# ---------- Expense Routes ----------
@app.route("/expenses", methods=["GET"])
def get_expenses():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("""
        SELECT expenses.id, expenses.item, expenses.amount, expenses.date, users.username
        FROM expenses
        JOIN users ON expenses.user_id = users.id
        WHERE expenses.user_id=?
    """, (user_id,))
    rows = c.fetchall()
    conn.close()

    return jsonify([
        {"id": r[0], "item": r[1], "amount": r[2], "date": r[3], "username": r[4]}
        for r in rows
    ])

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id or not data.get("item") or not data.get("amount") or not data.get("date"):
        return jsonify({"error": "All fields required"}), 400
    
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("INSERT INTO expenses (user_id, item, amount, date) VALUES (?, ?, ?, ?)",
              (user_id, data["item"], data["amount"], data["date"]))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Expense added!"})

@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json
    user_id = data.get("user_id")
    
    if not user_id or not data.get("item") or not data.get("amount") or not data.get("date"):
        return jsonify({"error": "All fields required"}), 400
    
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("UPDATE expenses SET item=?, amount=?, date=? WHERE id=? AND user_id=?",
              (data["item"], data["amount"], data["date"], id, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Expense updated!"})

@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id required"}), 400
    
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("DELETE FROM expenses WHERE id=? AND user_id=?", (id, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "Expense deleted!"})

# ---------- Run App ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
