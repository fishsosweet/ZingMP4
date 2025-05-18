import React, { useEffect, useState } from 'react';

interface ToastNotificationProps {
    message: string | null;
    isVisible: boolean;
    onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
    message,
    isVisible,
    onClose,
}) => {
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        console.log('Toast useEffect - isVisible:', isVisible);
        if (isVisible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                console.log('Toast timeout finished - calling onClose');
                onClose(); // Hide after 2 seconds
            }, 2000);

            return () => {
                console.log('Toast useEffect cleanup - clearing timeout');
                clearTimeout(timer);
            };
        } else {
            const timer = setTimeout(() => {
                console.log('Toast exit animation timeout finished - setting shouldRender(false)');
                setShouldRender(false);
            }, 300); // Match the exit animation duration (adjust if needed)
            return () => {
                console.log('Toast useEffect cleanup (exit) - clearing timeout');
                clearTimeout(timer);
            };
        }
    }, [isVisible, onClose]);

    if (!shouldRender) {
        console.log('Toast not rendering - shouldRender is false');
        return null;
    }

    console.log('Toast rendering - message:', message, 'isVisible:', isVisible);

    const toastStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#2a1a40',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        zIndex: 5000,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
    };

    return (
        <div style={toastStyle}>
            {message}
        </div>
    );
};

export default ToastNotification; 