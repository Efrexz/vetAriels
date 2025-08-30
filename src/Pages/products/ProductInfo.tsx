import { Link, useParams } from "react-router-dom";
import { useProductsAndServices } from "@context/ProductsAndServicesContext";
import { Product } from "@t/inventory.types";
import { UpdateProduct } from "./UpdateProduct.jsx";
import { EditProductPrice } from "./EditProductPrice.jsx";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";
import { NotFound } from "@components/ui/NotFound";

function ProductInfo() {

    const { productsData } = useProductsAndServices();

    const { section = 'update', id } = useParams<{ id: string; section?: string }>();

    const product: Product | undefined = productsData.find(product => product.systemCode === id);

    if (!product) {
        return (
            <NotFound
                entityName="Producto"
                searchId={id!}
                returnPath="/products"
            />
        );
    }

    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-medium mb-4 border-b-2 border-gray-200 pb-3 text-blue-400" >
                {product.productName}
            </h2>
            <HorizontalMenu mode={"products"} />
            <section >
                {section === 'update' && <UpdateProduct productData={product} />}
                {section === 'prices' && <EditProductPrice productData={product} />}
            </section>
        </main>
    );
}

export { ProductInfo };