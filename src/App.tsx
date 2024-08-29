import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from "./pages/LoginScreen.tsx";
import TempPrint from "./pages/TempPrint.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginScreen />} />
            </Routes>
        </Router>
    );
};

export default App;