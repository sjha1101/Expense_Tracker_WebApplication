# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import hashlib
import os
from dotenv import load_dotenv

# ---------- Load environment variables ----------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# ---------- Flask setup ----------
app = Flask(__name__)
CORS(app)

# ---------- MongoDB setup ----------
try:
    client = MongoClient(MONGO_URI)
    db = client["expense_tracker"]
    users_collection = db["users"]
    expenses_collection = db["expenses"]
    print("Connected to MongoDB Atlas!")
except Exception as e:
    print("Error connecting to MongoDB:", e)

# ---------- Helper functions ----------
def hash_password(password):
    """Hash a password with SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

# ---------- Routes ----------
@app.route("/", methods=["GET"])
def home():
    return "Expense Tracker Backend is running!"

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json(force=True)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        if users_collection.find_one({"username": username}):
            return jsonify({"error": "Username already exists"}), 400

        users_collection.insert_one({
            "username": username,
            "password": hash_password(password)
        })

        return jsonify({"message": "User registered successfully!"})
    except Exception as e:
        print("Register Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True)
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password required"}), 400

        user = users_collection.find_one({
            "username": username,
            "password": hash_password(password)
        })

        if user:
            return jsonify({
                "message": "Login successful",
                "user": {"id": str(user["_id"]), "username": user["username"]}
            })
        return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print("Login Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/expenses", methods=["POST"])
def add_expense():
    try:
        data = request.get_json(force=True)
        user_id = data.get("user_id")
        item = data.get("item")
        amount = data.get("amount")
        date = data.get("date")

        if not user_id or not item or not amount or not date:
            return jsonify({"error": "All fields required"}), 400

        expenses_collection.insert_one({
            "user_id": ObjectId(user_id),
            "item": item,
            "amount": amount,
            "date": date
        })

        return jsonify({"message": "Expense added successfully!"})
    except Exception as e:
        print("Add Expense Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/expenses", methods=["GET"])
def get_expenses():
    try:
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id required"}), 400

        rows = expenses_collection.find({"user_id": ObjectId(user_id)})
        expenses = []
        for r in rows:
            expenses.append({
                "id": str(r["_id"]),
                "item": r["item"],
                "amount": r["amount"],
                "date": r["date"]
            })

        return jsonify(expenses)
    except Exception as e:
        print("Get Expenses Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/expenses/<expense_id>", methods=["PUT"])
def update_expense(expense_id):
    try:
        data = request.get_json(force=True)
        item = data.get("item")
        amount = data.get("amount")
        date = data.get("date")

        if not item or not amount or not date:
            return jsonify({"error": "All fields required"}), 400

        result = expenses_collection.update_one(
            {"_id": ObjectId(expense_id)},
            {"$set": {"item": item, "amount": amount, "date": date}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Expense not found"}), 404

        return jsonify({"message": "Expense updated successfully!"})
    except Exception as e:
        print("Update Expense Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/expenses/<expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    try:
        result = expenses_collection.delete_one({"_id": ObjectId(expense_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Expense not found"}), 404

        return jsonify({"message": "Expense deleted successfully!"})
    except Exception as e:
        print("Delete Expense Error:", e)
        return jsonify({"error": str(e)}), 500

# ---------- Run server ----------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)