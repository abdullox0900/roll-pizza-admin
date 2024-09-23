import { X } from 'lucide-react'
import React, { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-boxdark p-8 rounded-sm shadow-lg w-96 max-w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-black dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="text-black dark:text-white">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal