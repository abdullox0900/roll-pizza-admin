import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'

interface Category {
    id: number
    name: string
}

const categoryData: Category[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
    { id: 4, name: 'Home & Garden' },
    { id: 5, name: 'Sports & Outdoors' },
]

const CategoryTable: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [data, setData] = useState<any>([])

    const getData = () => {
        axios.get('http://localhost:3000/api/admin/categories').then(data => setData(data.data))
    }

    useEffect(() => {
        getData()
    }, [])
    const sendCategory = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/admin/categories', { name: inputValue })
            console.log(response)
            setIsModalOpen(false)
            getData()
            // Modal yopiladi
            // Bu yerda kategoriyalar ro'yxatini yangilash uchun kod qo'shishingiz mumkin
        } catch (error) {
            console.error('Error creating category:', error)
            // Bu yerda foydalanuvchiga xato haqida xabar berish uchun kod qo'shishingiz mumkin
        }
    }
    const handleDelete = (id: number) => {
        console.log(`Delete category with id: ${id}`)
        // Implement delete logic here
    }

    const handleUpdate = (id: number) => {
        console.log(`Update category with id: ${id}`)
        // Implement update logic here
    }

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex items-center justify-between mb-6 '>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Categories
                </h4>

                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Add</button>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Name
                        </h5>
                    </div>
                </div>

                {data?.map((category: any, key: number) => (
                    <div
                        className={`grid grid-cols-2 ${key === categoryData.length - 1
                            ? ''
                            : 'border-b border-stroke dark:border-strokedark'
                            }`}
                        key={category.id}
                    >
                        <div className="flex items-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{category.name}</p>
                        </div>

                        <div className="flex items-center justify-end p-2.5 xl:p-5">
                            <button
                                onClick={() => handleUpdate(category.id)}
                                className="text-meta-3 hover:text-primary"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-meta-1 hover:text-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create category"
            >
                <div className="mb-4.5">
                    <input
                        type="text"
                        placeholder="Category name"
                        onChange={(event) => setInputValue(event.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendCategory}>
                    Create
                </button>
            </Modal>
        </div>
    )
}

export default CategoryTable