import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/store/admin/products-slice";
import AdminProductTile from "@/components/admin-view/product-tile";


function AdminProducts() {
    const dispatch = useDispatch();
    const { productList: products, isLoading: loading, error } = useSelector((state) => state.adminProducts);



    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Products</h1>
            
            <div className="bg-white rounded-lg shadow p-6">
                {products && products.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-19 px-15">
                        {products.map((product) => (
                            <AdminProductTile 
                                key={product._id} 
                                product={product} 
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products found. Add your first product to get started.</p>
                )}
            </div>
        </div>
    );
}

export default AdminProducts;