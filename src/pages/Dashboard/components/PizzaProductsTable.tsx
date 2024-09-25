import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Modal from '../../../components/Modal/Modal'

interface PizzaData {
    name: string
    price: string
    description: string
    categoryId: string
    image: File | null
}

const API_URL = import.meta.env.VITE_API_URL as string

const PizzaProductsTable: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pizzaData, setPizzaData] = useState<PizzaData>({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        image: null
    })
    const [pizzas, setPizzas] = useState<any>([])
    const [categories, setCategories] = useState<any>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isTableLoading, setIsTableLoading] = useState(true)
    const [editingPizza, setEditingPizza] = useState<any>(null)

    const getPizzas = async () => {
        setIsTableLoading(true)
        try {
            const response = await axios.get(`${API_URL}/api/admin/pizzas`)
            setPizzas(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке пицц:', error)
        } finally {
            setIsTableLoading(false)
        }
    }

    const getCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/categories`)
            setCategories(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error)
        }
    }

    useEffect(() => {
        getPizzas()
        getCategories()
    }, [])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setPizzaData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPizzaData(prevState => ({
                ...prevState,
                image: file
            }))
        }
    }

    const sendPizza = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()

            Object.entries(pizzaData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    if (key === 'image' && value instanceof File) {
                        formData.append(key, value)
                    } else {
                        formData.append(key, value.toString())
                    }
                }
            })

            if (editingPizza) {
                await axios.put(`${API_URL}/api/admin/pizzas/${editingPizza._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            } else {
                await axios.post(`${API_URL}/api/admin/pizzas`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            }
            setIsModalOpen(false)
            setEditingPizza(null)
            setPizzaData({
                name: '',
                price: '',
                description: '',
                categoryId: '',
                image: null
            })
            getPizzas()
        } catch (error) {
            console.error('Ошибка при сохранении пиццы:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        try {
            await axios.delete(`${API_URL}/api/admin/pizzas/${id}`)
            getPizzas()
        } catch (error) {
            console.error('Ошибка при удалении пиццы:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = (pizza: any) => {
        setEditingPizza(pizza)
        setPizzaData({
            name: pizza.name,
            price: pizza.price.toString(),
            description: pizza.description,
            categoryId: pizza.categoryId,
            image: null
        })
        setIsModalOpen(true)
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex items-center justify-between mb-6 '>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Пиццы
                </h4>

                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : 'Добавить пиццу'}
                </button>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Изображение
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Название
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Цена
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Категория
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Действия
                        </h5>
                    </div>
                </div>

                {isTableLoading ? (
                    // Skeleton loader
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-5 border-b border-stroke dark:border-strokedark animate-pulse">
                            <div className="flex items-center p-2.5 xl:p-5">
                                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            </div>
                            <div className="flex items-center justify-end p-2.5 xl:p-5">
                                <div className="h-8 bg-gray-300 rounded w-8 mr-3"></div>
                                <div className="h-8 bg-gray-300 rounded w-8"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    pizzas.map((pizza: any) => (
                        <div
                            className="grid grid-cols-5 border-b border-stroke dark:border-strokedark"
                            key={pizza._id}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <img src={`${API_URL}${pizza.imageUrl}`} alt={pizza.name} className="w-16 h-16 object-cover rounded-full" />
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{pizza.name}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">${pizza.price}</p>
                            </div>
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{pizza.categoryName}</p>
                            </div>
                            <div className="flex items-center justify-end p-2.5 xl:p-5">
                                <button
                                    onClick={() => handleUpdate(pizza)}
                                    className="text-meta-3 hover:text-primary mr-2"
                                    disabled={isLoading}
                                >
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(pizza._id)}
                                    className="text-meta-1 hover:text-danger"
                                    disabled={isLoading}
                                >
                                    <FaTrash size={20} />
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
                    setEditingPizza(null)
                    setPizzaData({
                        name: '',
                        price: '',
                        description: '',
                        categoryId: '',
                        image: null
                    })
                }}
                title={editingPizza ? "Обновить пиццу" : "Создать пиццу"}
            >
                <div className="flex flex-col gap-[20px] mb-4.5">
                    <select
                        name="categoryId"
                        value={pizzaData.categoryId}
                        onChange={handleInputChange}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 pl-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map((category: any) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Название"
                        value={pizzaData.name}
                        onChange={handleInputChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Цена"
                        value={pizzaData.price}
                        onChange={handleInputChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <textarea
                        name="description"
                        rows={6}
                        placeholder="Описание"
                        value={pizzaData.description}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                </div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendPizza} disabled={isLoading}>
                    {isLoading ? 'Загрузка...' : (editingPizza ? "Обновить" : "Создать")}
                </button>
            </Modal>
        </div>
    )
}

export default PizzaProductsTable