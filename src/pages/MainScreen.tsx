import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // Import useAuth
import { useNavigate } from "react-router-dom";
import {
    GetOrdersErrorInterface, OrderInterface,
} from "../utils/Types.ts";
import {getStores} from "../services/storeService.tsx";
import OrderCard from "../components/Order/OrderCard.tsx";
import {dateTimeFormatter} from "../utils/DateTimeFormatter.ts";
import Shimmer from "../components/Order/Shimmer.tsx";

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
    const [orders, setOrders] = useState<OrderInterface[]>([]); // Always initialize as an empty array
    const navigate = useNavigate(); // For navigation

    // Check if the user is authenticated, if not, redirect to the login page
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login"); // Redirect to login if not authenticated
        } else {
            getOrders();
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

    const isOrderArray = (response: OrderInterface[] | GetOrdersErrorInterface): response is OrderInterface[] => {
        return Array.isArray(response);
    }

    const getOrders = async (): Promise<void> => {
        const storeId: string = localStorage.getItem('storeId') || "";
        if (storeId.length === 0) {
            navigate('/login');
            return;
        }
        try {
            const fetchedOrders: OrderInterface[] | GetOrdersErrorInterface = await getStores(storeId, 0);
            if (isOrderArray(fetchedOrders)) {
                setOrders(fetchedOrders); // Set orders only if the response is correct
            } else {
                console.error(fetchedOrders.message); // Handle error response
            }
        } catch (error: any) {
            console.error("This is the error from fetching orders", error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state while checking authentication
    }

    return (
        <>
            <nav className="shadow-md flex justify-between">
                <div></div>
                <div className="flex justify-center pt-8">
                    <MenuItem label="All Orders" isActive={activeFilter === "All Orders"} onClick={() => handleFilterClick("All Orders")} />
                    <MenuItem label="Pending" isActive={activeFilter === "Pending"} onClick={() => handleFilterClick("Pending")} />
                    <MenuItem label="Completed" isActive={activeFilter === "Completed"} onClick={() => handleFilterClick("Completed")} />
                    <MenuItem label="Urgent" isActive={activeFilter === "Urgent"} onClick={() => handleFilterClick("Urgent")} />
                    <MenuItem label="Cancelled" isActive={activeFilter === "Cancelled"} onClick={() => handleFilterClick("Cancelled")} />
                </div>
                <div className="p-4">
                    <button
                        className="font-bold text-white bg-red-500 px-4 py-2 rounded"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            <div className="flex flex-wrap justify-center m-20 gap-4">
                {
                    orders.length > 0 ? (
                        orders.map((order: OrderInterface, index: number) => (
                            <OrderCard
                                key={index + order.id}
                                totalFiles={order.fileNames.length}
                                fileIds={order.fileNames}
                                amount={order.orderAmount}
                                name={order.userName}
                                mobileNumber={order.userId}
                                dateTime={dateTimeFormatter(order.localDateTime)}
                            />
                        ))
                    ) : (
                    <Shimmer total={5} type='order'/>
                    )
                }
            </div>
        </>
    );
};

export default MainScreen;
