"use client";

export default function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?", 
    confirmText = "Confirm", 
    cancelText = "Cancel" 
}) {
    if (!isOpen) return null; // Don't render if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-80 text-center">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2">{message}</p>
                <div className="flex justify-around mt-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}