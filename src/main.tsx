import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Ensure this is imported correctly

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
