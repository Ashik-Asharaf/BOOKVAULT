import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

function AdminProductTile({ product }) {
    const navigate = useNavigate();
    
    const handleEditClick = () => {
        // Navigate to the add product page with the product ID as a URL parameter
        navigate(`/admin/products/add?edit=${product._id}`);
    };
    return (
        <Card className="w-full max-w-sm mx-auto overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative bg-gray-100 h-[250px] flex items-center justify-center">
                    {product?.image ? (
                        <img 
                            src={product.image} 
                            alt={product.title || 'Product image'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x300?text=No+Image+Available';
                            }}
                        />
                    ) : (
                        <div className="text-gray-400 p-4 text-center">No image available</div>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="p-4 flex-grow flex flex-col">
                    <CardContent className="p-0 mb-3">
                        <h2 className="text-lg font-bold mb-2 line-clamp-2 h-12 w-full flex justify-center gap-10">{product?.title || 'Untitled Product'}</h2>
                        <div className="flex justify-between items-center">
                            <span className={`${product?.salePrice > 0 ? 'line-through text-gray-500 text-sm' : 'text-lg font-semibold text-primary'}`}>
                                ${product?.price || '0.00'}
                            </span>
                            {product?.salePrice > 0 && (
                                <span className="text-lg font-bold text-primary">
                                    ${product.salePrice}
                                </span>
                            )}
                        </div>
                    </CardContent>
                    
                    {/* Buttons */}
                    <CardFooter className="p-0 mt-auto">
                        <div className="w-full flex justify-center gap-10">
                            <Button onClick={handleEditClick}>
                                Edit
                            </Button>
                            <Button variant="destructive">
                                Delete
                            </Button>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
    
}

export default AdminProductTile;
