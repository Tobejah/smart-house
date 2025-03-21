// src/App.jsx
import React from "react";
import DeviceList from "./components/DeviceList"; // Import your DeviceList component

function App() {
  return (
    <div className="App">
      <h1>Smart Home Dashboard</h1>
      <DeviceList /> {/* Render your DeviceList component here */}
    </div>
  );
}

export default App;
