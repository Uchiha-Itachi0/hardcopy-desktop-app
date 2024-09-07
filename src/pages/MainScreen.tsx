import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

interface MenuItemProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, isActive, onClick }) => (
    <button
        className={`font-semibold border-l border-r px-4 pb-2 ${isActive ? "text-blue-500 border-b-2 border-blue-500" : ""}`}
        onClick={onClick}
    >
        {label}
    </button>
);

const MainScreen: React.FC = () => {
    const { isAuthenticated, isLoading, logout } = useAuth(); // Use AuthContext
    const [activeFilter, setActiveFilter] = useState<string>("All Orders");
    const navigate = useNavigate(); // For navigation

    // Check if the user is authenticated, if not, redirect to the login page
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login"); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        // Implement your filter logic here, e.g., fetching/filtering orders based on the filter
    };

    const handleLogout = async () => {
        await logout(); // Call the logout function from AuthContext
        navigate("/login"); // Redirect to login after logout
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state while checking authentication
    }

    return (
        <>
            <nav className="shadow-md flex justify-center pt-8">
                <MenuItem label="All Orders" isActive={activeFilter === "All Orders"} onClick={() => handleFilterClick("All Orders")} />
                <MenuItem label="Pending" isActive={activeFilter === "Pending"} onClick={() => handleFilterClick("Pending")} />
                <MenuItem label="Completed" isActive={activeFilter === "Completed"} onClick={() => handleFilterClick("Completed")} />
                <MenuItem label="Urgent" isActive={activeFilter === "Urgent"} onClick={() => handleFilterClick("Urgent")} />
                <MenuItem label="Cancelled" isActive={activeFilter === "Cancelled"} onClick={() => handleFilterClick("Cancelled")} />
            </nav>

            <div className="flex justify-center pt-8">
                {/* Example: Add your content here, like a list of orders */}
                <h1 className="text-2xl font-bold">Orders List - {activeFilter}</h1>
            </div>

            <div className="flex justify-center pt-8">
                <button
                    className="font-bold text-white bg-red-500 px-4 py-2 rounded"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default MainScreen;
