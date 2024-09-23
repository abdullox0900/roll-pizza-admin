import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Modal from '../../../components/Modal/Modal'

interface PizzaData {
    name: string
    price: string
    description: string
    categoryId: string
    image: File | null
}

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

    const getPizzas = () => {
        axios.get('http://localhost:3000/api/admin/pizzas').then(response => setPizzas(response.data))
    }

    const getCategories = () => {
        axios.get('http://localhost:3000/api/admin/categories').then(response => setCategories(response.data))
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
        try {
            const formData = new FormData()

            Object.entries(pizzaData).forEach(([key, value]) => {
                if (value !== null) {
                    if (key === 'image' && value instanceof File) {
                        formData.append(key, value)
                    } else if (typeof value === 'string' || typeof value === 'number') {
                        formData.append(key, value.toString())
                    }
                }
            })

            const response = await axios.post('http://localhost:3000/api/admin/pizzas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(response)
            setIsModalOpen(false)
            getPizzas()
        } catch (error) {
            console.error('Error creating pizza:', error)
        }
    }

    const handleDelete = (id: number) => {
        console.log(`Delete pizza with id: ${id}`)
        // Implement delete logic here
    }

    const handleUpdate = (id: number) => {
        console.log(`Update pizza with id: ${id}`)
        // Implement update logic here
    }

    console.log(pizzas)


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex items-center justify-between mb-6 '>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                    Pizza Products
                </h4>

                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10">Add Pizza</button>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Image
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Name
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Price
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Category
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Actions
                        </h5>
                    </div>
                </div>

                {pizzas.map((pizza: any, key: number) => (
                    <div
                        className={`grid grid-cols-5 ${key === pizzas.length - 1
                            ? ''
                            : 'border-b border-stroke dark:border-strokedark'
                            }`}
                        key={pizza.id}
                    >
                        <div className="flex items-center p-2.5 xl:p-5">
                            <img src={`http://localhost:3000${pizza.imageUrl}`} alt={pizza.name} className="w-16 h-16 object-cover rounded-full" />
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
                                onClick={() => handleUpdate(pizza.id)}
                                className="text-meta-3 hover:text-primary mr-2"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(pizza.id)}
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
                title="Create Pizza"
            >
                <div className="flex flex-col gap-[20px] mb-4.5">
                    <select
                        name="categoryId"
                        onChange={handleInputChange}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 pl-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                    >
                        <option value="">Select Category</option>
                        {categories.map((category: any) => (
                            <option key={category.id} value={category.id}>
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
                        placeholder="Name"
                        onChange={handleInputChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        onChange={handleInputChange}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    <textarea
                        name="description"
                        rows={6}
                        placeholder="Description"
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                </div>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90" onClick={sendPizza}>
                    Create Pizza
                </button>
            </Modal>
        </div>
    )
}

export default PizzaProductsTable