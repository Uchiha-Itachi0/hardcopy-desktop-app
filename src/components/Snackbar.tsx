/*
* Snackbar component is used to show a message at the bottom of the screen for a certain duration.
*
* */

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface SnackbarProps {
    message: string;
    duration?: number;
    onClose?: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(100);
    const [exiting, setExiting] = useState<boolean>(false);

    // Use callback is used to memoize the function so that it doesn't change on every render
    const closeSnackbar = useCallback((): void => {
        setExiting(true);
        setTimeout((): void => {
            if (onClose) onClose();
        }, 500);  // For animation delay
    }, [onClose]);

    useEffect(() => {

        // For appearing animation
        const timeoutId: NodeJS.Timeout = setTimeout((): void => {
            setVisible(true);
        }, 100);

        const interval: NodeJS.Timeout = setInterval((): void => {
            setProgress((prev: number): number => {
                const newProgress: number = prev - (100 / (duration / 100));
                if (newProgress <= 0) {
                    clearInterval(interval);
                    closeSnackbar();
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        const timer = setTimeout(() => {
            clearInterval(interval);
            closeSnackbar();
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
            clearTimeout(timeoutId);
        };
    }, [duration, closeSnackbar]);

    return createPortal(
        <div className={`fixed z-[10000] bottom-0 left-0 right-0 flex justify-center p-4 transition-transform duration-500 ease-in-out ${visible ? 'translate-y-0' : 'translate-y-full'} ${exiting ? 'translate-y-full' : ''}`}>
            <div className="bg-gray-800 text-white px-4 py-2 rounded shadow-md flex flex-col items-center w-full max-w-sm">
                <span>{message}</span>
                <div className="w-full h-1 bg-gray-600 mt-2">
                    <div className="h-full bg-primary-blue transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Snackbar;
