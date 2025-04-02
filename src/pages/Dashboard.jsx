import React from 'react';
import DeviceList from '../components/DeviceList';
import logo from '../assets/logo.png';


export default function Dashboard() {
    return (
        <div style={{ backgroundColor: '#dddfd6', minHeight: '100vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt='' style={{ width: '50px', height: '50px', marginRight: '10px' }}></img>
                    <h1 style={{ fontFamily: 'Tenor Sans', margin: 0 }}>HomeSync</h1>
                </div>
            </div>
            <div style={{ flex: 2, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <DeviceList />
            </div>
        </div>
    );
}