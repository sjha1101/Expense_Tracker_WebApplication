from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, hashlib

app = Flask(__name__)
CORS(app)  # Allow React to connect

# ---------- Database Setup ----------
def init_db():
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
                  item TEXT,
                  amount REAL,
                  date TEXT)""")

    conn.commit()
    conn.close()

init_db()


# ---------- Helpers ----------
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


# ---------- User Routes ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username, password = data.get("username"), data.get("password")

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
    username, password = data.get("username"), data.get("password")

    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=? AND password=?",
              (username, hash_password(password)))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login successful", "user": {"id": user[0], "username": user[1]}})
    else:
        return jsonify({"error": "Invalid username or password"}), 401


# ---------- Expense Routes ----------
@app.route("/expenses", methods=["GET"])
def get_expenses():
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("SELECT * FROM expenses")
    rows = c.fetchall()
    conn.close()
    return jsonify([{"id": r[0], "item": r[1], "amount": r[2], "date": r[3]} for r in rows])


@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.json
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("INSERT INTO expenses (item, amount, date) VALUES (?, ?, ?)",
              (data["item"], data["amount"], data["date"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense added!"})


@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("UPDATE expenses SET item=?, amount=?, date=? WHERE id=?",
              (data["item"], data["amount"], data["date"], id))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense updated!"})


@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    conn = sqlite3.connect("expenses.db")
    c = conn.cursor()
    c.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense deleted!"})


# ---------- Run App ----------
if __name__ == "__main__":
    app.run(debug=True)
