from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os, hashlib

load_dotenv() 
MONGO_URI = os.getenv("MONGO_URI") 
client = MongoClient(MONGO_URI)
app = Flask(__name__)
CORS(app)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route("/", methods=["GET"])
def home():
    return "Expense Tracker Backend is running!"

db = client["expense_tracker"]
users_collection = db["users"]
expenses_collection = db["expenses"]

@app.route("/register", methods=["POST"])
def register():
    data = request.json
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

    return jsonify({"message": "User registered!"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
