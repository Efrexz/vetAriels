import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductsAndServicesContext } from "@context/ProductsAndServicesContext";
import { UpdateProduct } from "./UpdateProduct.jsx";
import { EditProductPrice } from "./EditProductPrice.jsx";
import { HorizontalMenu } from "@components/ui/HorizontalMenu";

function ProductInfo() {

    const { section, id } = useParams();
    const { productsData } = useContext(ProductsAndServicesContext);
    const product = productsData.find(product => product.systemCode === id);
    return (
        <main className="w-full mx-auto p-6 bg-white">
            <h2 className="text-xl sm:text-3xl font-medium mb-4 border-b-2 border-gray-200 pb-3 text-blue-400" >{product?.productName}</h2>
            <HorizontalMenu mode={"products"} />
            <section >
                {section === 'update' && <UpdateProduct productData={product} />}
                {section === 'prices' && <EditProductPrice productData={product} />}
            </section>
        </main>
    );
}

export { ProductInfo };