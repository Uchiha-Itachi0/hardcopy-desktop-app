import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { checkStoredSession as checkStoredSessionService, login as loginService, logout as logoutService } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (mobileNumber: string, otp: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkStoredSession();
    }, []);

    const checkStoredSession = async () => {
        try {
            const storedSession: boolean = await checkStoredSessionService();
            if (storedSession) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Failed to check stored session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (mobileNumber: string, otp: string): Promise<boolean> => {
        try {
            const response = await loginService(mobileNumber, otp);
            if (response.success) {
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutService();
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};