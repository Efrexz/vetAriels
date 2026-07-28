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
        <section className="w-full">
            <div className="mb-6">
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate mb-1">
                    Detalle del producto
                </span>
                <h1 className="text-2xl font-bold font-display text-ink">
                    {product.productName}
                </h1>
            </div>
            <div className="mb-5">
                <HorizontalMenu mode={"products"} />
            </div>
            <section>
                {section === 'update' && <UpdateProduct productData={product} />}
                {section === 'prices' && <EditProductPrice productData={product} />}
            </section>
        </section>
    );
}

export { ProductInfo };