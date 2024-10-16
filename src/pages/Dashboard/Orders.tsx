import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import Modal from '../../components/Modal/Modal'

interface Order {
    id: string
    userId: string
    items: Array<{ pizzaId: string; quantity: number; name: string; price: number }>
    totalPrice: number
    name: string
    phone: string
    address: string
    usedBonus: number
    date: string
}

const API_URL = import.meta.env.VITE_API_URL as string

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const getOrders = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${API_URL}/api/admin/orders`)
            setOrders(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Заказы
            </h4>

            <div className="flex flex-col">
                <div className="grid grid-cols-7 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            ID
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Имя
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Телефон
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Адрес
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Сумма
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Дата
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Действия
                        </h5>
                    </div>
                </div>

                {isLoading ? (
                    // Skeleton loader
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-7 border-b border-stroke dark:border-strokedark animate-pulse">
                            {[...Array(7)].map((_, cellIndex) => (
                                <div key={cellIndex} className="flex items-center p-2.5 xl:p-5">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    orders.map((order) => (
                        <div
                            key={order?.id}
                            className="grid grid-cols-7 border-b border-stroke dark:border-strokedark"
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">😀</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{order?.name}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{order?.phone}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{order?.address.slice(0, 15)}...</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-meta-3">{order?.totalPrice}₽</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{new Date(order?.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center justify-center p-2.5 xl:p-5">
                                <button
                                    onClick={() => handleViewDetails(order)}
                                    className="hover:text-primary"
                                >
                                    <FaEye size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedOrder(null)
                }}
                title="Детали заказа"
            >
                {selectedOrder && (
                    <div className="flex flex-col gap-4">
                        <p><strong>ID заказа:</strong> {selectedOrder.id}</p>
                        <p><strong>Имя:</strong> {selectedOrder.name}</p>
                        <p><strong>Телефон:</strong> {selectedOrder.phone}</p>
                        <p><strong>Адрес:</strong> {selectedOrder.address}</p>
                        <p><strong>Сумма:</strong>{selectedOrder.totalPrice}₽</p>
                        <p><strong>Использованные бонусы:</strong> {selectedOrder.usedBonus}</p>
                        <p><strong>Дата:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                        <div>
                            <strong>Товары:</strong>
                            <ul className="list-disc list-inside mt-2">
                                {selectedOrder.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} шт. ({item.price}₽ за шт.)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default Orders
