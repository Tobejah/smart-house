// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <main>
                <div className="p-6">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
