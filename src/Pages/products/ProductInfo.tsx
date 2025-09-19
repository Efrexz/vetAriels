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
        <main className="w-full mx-auto p-6 bg-gray-800 text-gray-200 rounded-md">
            <h2 className="text-xl sm:text-3xl font-medium mb-4 border-b-2 border-gray-700 pb-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400">
                    {product.productName}
                </span>
            </h2>
            <HorizontalMenu mode={"products"} />
            <section>
                {section === 'update' && <UpdateProduct productData={product} />}
                {section === 'prices' && <EditProductPrice productData={product} />}
            </section>
        </main>
    );
}

export { ProductInfo };