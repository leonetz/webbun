interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: "md" | "lg" | "xl" | "2xl" | "3xl";  // เพิ่ม "2xl" และ "3xl" เป็นตัวเลือก
}

export default function Modal({
    title,
    isOpen,
    onClose,
    children,
    size = "md" // กำหนด default เป็น "md"
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        "2xl": 'max-w-2xl',  // เพิ่มขนาด 2xl
        "3xl": 'max-w-3xl',  // เพิ่มขนาด 3xl
    }[size];  // เลือกค่า size ที่ถูกต้องจาก object

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity">
            <div className={`relative z-50 w-full rounded-lg bg-white shadow-lg border-2 border-red-600 ${sizeClasses}`}>
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
