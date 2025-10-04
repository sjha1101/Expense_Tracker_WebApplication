import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Expensehistory from "./pages/Expensehistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {<Route path="/login" element={<Login />} />}
        {<Route path="/register" element={<Register />} />}
        <Route path="/history" element={<Expensehistory />} />

      </Routes>
    </Router>
  );
}

export default App;
