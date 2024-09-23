import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import PizzaProductsTable from './components/PizzaProductsTable'

const Products = () => {
    return (
        <div>
            <Breadcrumb pageName="Products" />
            <PizzaProductsTable />
        </div>
    )
}

export default Products
