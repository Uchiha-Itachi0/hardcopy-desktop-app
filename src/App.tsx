import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './pages/LoginScreen';
import MainScreen from './pages/MainScreen';
import File from "./components/File/File.tsx";

const App: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Show loading screen while checking authentication
    }

    return (
        <Router>
            <Routes>
                {/* If the user is not authenticated, navigate them to the login screen */}
                <Route
                    path="/"
                    element={isAuthenticated ? <MainScreen /> : <Navigate to="/login" />}
                />

                {/* Login route */}
                <Route path="/login" element={<LoginScreen />} />

                {/* Protected route for content screen */}
                <Route
                    path="/content"
                    element={isAuthenticated ? <MainScreen /> : <Navigate to="/login" />}
                />
                <Route
                    path="/files"
                    element={isAuthenticated ? <File /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App