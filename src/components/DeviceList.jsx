import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:5000'; 

// Establish the WebSocket connection
const socket = io(WS_URL);  // Use WS_URL environment variable for WebSocket URL

function DeviceList() {
  const [devices, setDevices] = useState([]);

  // Fetch devices initially
  useEffect(() => {
    fetchDevices();

    // Listen for real-time updates from the server
    socket.on('device:update', (updatedDevice) => {
      // Log the received data to check if it's correct
      console.log('Received device:update:', updatedDevice);

      // Update the devices state with the updated device data
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === updatedDevice.id ? updatedDevice : device
        )
      );
    });

    // Cleanup the event listener when the component is unmounted
    return () => {
      socket.off('device:update');
    };
  }, []);

  // Fetch devices from the server
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

  // Toggle device status (sending a patch request to the backend)
  const toggleDeviceStatus = async (device) => {
    const updatedStatus = !device.status;
    const updatedLightStatus = updatedStatus ? 'on' : 'off';  // Change the value to 'on' or 'off'

    try {
      // Send the PATCH request to update the device
      const response = await fetch(`${API_URL}/device/${device.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: updatedStatus,
          value: updatedStatus ? 1.0 : 0.0, // Update the value based on status
        }),
      });

      const updatedDevice = await response.json();
      if (updatedDevice.error) {
        console.error('Failed to update device:', updatedDevice.error);
      } else {
        // Log the emitted event to check the JSON being sent
        const deviceKey = device.name.toLowerCase();  // Use device name as key
        console.log(`Emitting device:update: { ${deviceKey}: '${updatedLightStatus}' }`);

        // Emit the socket event with the correct payload once the device status is updated
        socket.emit('device:update', { [deviceKey]: updatedLightStatus });
      }
    } catch (err) {
      console.error('Failed to update device status:', err);
    }
  };

  return (
    <div>
      {devices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        <ul>
          {devices.map((device) => (
            <li key={device.id} className="mb-4 p-3 border rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{device.name} ({device.type})</h3>
                <p>Status: {device.status ? 'ON' : 'OFF'}</p>
              </div>
              <button
                onClick={() => toggleDeviceStatus(device)}
                className={`px-4 py-2 rounded ${device.status ? 'bg-red-500' : 'bg-green-500'} text-white`}
              >
                {device.status ? 'Turn OFF' : 'Turn ON'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DeviceList;
