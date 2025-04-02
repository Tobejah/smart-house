// DeviceList.jsx

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './DeviceList.css';
import { FaTrashAlt } from "react-icons/fa";
import { LuSettings2 } from "react-icons/lu";
import { IconContext } from "react-icons";


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';

// Establish the WebSocket connection
const socket = io(WS_URL);

function DeviceList() {
    const [devices, setDevices] = useState([]);

    // Fetch devices on mount
    useEffect(() => {
        fetchDevices();

        // Listen for real-time updates from the server
        socket.on('device:update', (updatedDevice) => {
            console.log('Received device:update:', updatedDevice);

            // Update the devices state with the new device data
            setDevices((prevDevices) =>
                prevDevices.map((device) =>
                    device.id === updatedDevice.id ? updatedDevice : device
                )
            );
        });

        // Cleanup socket listener when unmounting
        return () => {
            socket.off('device:update');
        };
    }, []);

    // Fetch devices from the backend
    const fetchDevices = async () => {
        try {
            const response = await fetch(`${API_URL}/device/all`);
            const data = await response.json();
            if (data.data) {
                setDevices(data.data.devices);
            }
        } catch (err) {
            console.error("Failed to fetch devices:", err);
        }
    };

    // Toggle device status (PATCH request to backend)
    const toggleDeviceStatus = async (device) => {
        const updatedStatus = !device.status;
        const updatedLightStatus = updatedStatus ? 'ON' : 'OFF';

        try {
            // Send the PATCH request to update the device
            const response = await fetch(`${API_URL}/device/${device.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: updatedStatus,
                    value: updatedStatus ? 1.0 : 0.0,
                }),
            });

            const updatedDevice = await response.json();
            if (updatedDevice.error) {
                console.error('Failed to update device:', updatedDevice.error);
            } else {
                // Emit WebSocket event with proper format
                const deviceKey = device.name; // Ensure it's a string
                const emitPayload = { device_name: deviceKey, status: updatedLightStatus };

                console.log("Emitting device:update:", emitPayload);

                socket.emit('device:update', emitPayload);
            }
        } catch (err) {
            console.error('Failed to update device status:', err);
        }
    };

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            {devices.length === 0 ? (
                <p>No devices found.</p>
            ) : (
                <div className="device-grid">
                    {devices.map((device) => (
                        <div key={device.id} className="device-item">
                            <div className="device-header">
                                <h3 className="device-name">{device.name} ({device.type})</h3>
                                <div className="device-buttons">
                                    <IconContext.Provider value={{ size: "25px" }}>
                                        <LuSettings2 className="device-button" />
                                        <FaTrashAlt className="device-button" />
                                    </IconContext.Provider>
                                </div>
                            </div>
                            <div className="device-info">
                                <p>Status: {device.status ? 'ON' : 'OFF'}</p>
                            </div>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={device.status}
                                    onChange={() => toggleDeviceStatus(device)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DeviceList;
