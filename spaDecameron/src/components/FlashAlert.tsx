import React from 'react';

interface FlashAlertProps {
    children: React.ReactNode;
}

const FlashAlert: React.FC<FlashAlertProps> = ({ children }) => {
    return (
        <div
            role="alert"
            className="
        bg-green-100 
        border border-green-400 
        text-green-700 
        px-4 py-3 
        rounded 
        mb-4 
        flex items-start
      "
        >
            <div className="italic prose-sm">
                {children}
            </div>
        </div>
    );
};

export default FlashAlert;
