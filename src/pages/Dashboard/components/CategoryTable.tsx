import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Modal from '../../../components/Modal/Modal'

const API_URL = import.meta.env.VITE_API_URL as string

const CategoryTable: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [data, setData] = useState<any>([])
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isTableLoading, setIsTableLoading] = useState(true)

    const getData = async () => {
        setIsTableLoading(true)
        try {
            const response = await axios.get(`${API_URL}/api/admin/categories`)
            setData(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке категорий:', error)
        } finally {
            setIsTableLoading(false)
        }
    }

    console.log(data)


    useEffect(() => {
        getData()
    }, [])

    const sendCategory = async () => {
        setIsLoading(true)
        try {
            if (editingCategory) {
                await axios.put(`${API_URL}/api/admin/categories/${editingCategory._id}`, { name: inputValue })
            } else {
                await axios.post(`${API_URL}/api/admin/categories`, { name: inputValue })
            }
            setIsModalOpen(false)
            setEditingCategory(null)
            setInputValue('')
            getData()
        } catch (error) {
            console.error('Ошибка при сохранении категории:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        setIsLoading(true)
        try {
            await axios.delete(`${API_URL}/api/admin/categories/${id}`)
            getData()
        } catch (error) {
            console.error('Ошибка при удалении категории:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = (category: any) => {
        setEditingCategory(category)
        setInputValue(category.name)
        setIsModalOpen(true)
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex items-center justify-between mb-6 '>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Категории
                </h4>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Добавить'}
                </button>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Название
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm text-end font-medium uppercase xsm:text-base">
                            Действия
                        </h5>
                    </div>
                </div>

                {isTableLoading ? (
                    // Skeleton loader
                    [...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-2 border-b border-stroke dark:border-strokedark animate-pulse">
                            <div className="flex items-center p-2.5 xl:p-5">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            </div>
                            <div className="flex items-center justify-start p-2.5 xl:p-5">
                                <div className="h-8 bg-gray-300 rounded w-8 mr-3"></div>
                                <div className="h-8 bg-gray-300 rounded w-8"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    data?.map((category: any) => (
                        <div
                            className="grid grid-cols-2 border-b border-stroke dark:border-strokedark"
                            key={category._id}
                        >
                            <div className="flex items-center p-2.5 xl:p-5">
                                <p className="text-black dark:text-white">{category.name}</p>
                            </div>

                            <div className="flex items-center justify-end p-2.5 xl:p-5">
                                <button
                                    onClick={() => handleUpdate(category)}
                                    className="text-meta-3 hover:text-primary mr-3"
                                    disabled={isLoading}
                                >
                                    <FaEdit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
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
                    setEditingCategory(null)
                    setInputValue('')
                }}
                title={editingCategory ? "Обновить категорию" : "Создать категорию"}
            >
                <div className="mb-4.5">
                    <input
                        type="text"
                        placeholder="Название категории"
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <button
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    onClick={sendCategory}
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : (editingCategory ? "Обновить" : "Создать")}
                </button>
            </Modal>
        </div>
    )
}

export default CategoryTable