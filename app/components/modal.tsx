interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({
    title,
    isOpen,
    onClose,
    children,
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity">
            <div className="relative z-50 w-full max-w-lg rounded-lg bg-white shadow-lg border-2 border-red-600">
                <div className="flex items-center justify-between border-b p-4 border-red-600 bg-red-600">
                    <h3 className="text-lg font-semibold text-white">
                        {title}
                    </h3>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-white hover:bg-red-500 hover:text-white transition-colors duration-200">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="p-4 text-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
}
