import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { addProductFormElements } from "@/config";
import ImageUpload from "@/components/ui/image-upload";
import formStyles from "./productForm.module.css";
import { useDispatch,useSelector } from "react-redux";
import {addNewProduct, fetchAllProducts} from "@/store/admin/products-slice"
import toast from "react-hot-toast";

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: "",
  salePrice: '',
  totalStock: ''
};

function AddProduct() {
  const navigate = useNavigate();
  const [openCreateProductsDialog,setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { productList} = useSelector((state)=>state.adminProducts)
  const dispatch = useDispatch()


  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First upload the image to Cloudinary if a new image is selected
      let imageUrl = uploadedImageUrl;
      
      if (imageFile && !uploadedImageUrl) {
        setImageLoadingState(true);
        const formData = new FormData();
        formData.append('file', imageFile);
        // Make sure to replace these with your actual Cloudinary credentials
        formData.append('upload_preset', 'bookvault'); // Your Cloudinary upload preset
        formData.append('cloud_name', 'dquhriqz3'); // Your Cloudinary cloud name
        
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dquhriqz3/image/upload', {
          method: 'POST',
          body: formData,
        });
        
        const cloudinaryData = await cloudinaryResponse.json();
        imageUrl = cloudinaryData.secure_url;
        setUploadedImageUrl(imageUrl);
        setImageLoadingState(false);
      }
      
      // Prepare product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
        totalStock: Number(formData.totalStock),
        image: imageUrl
      };
      
      // Save product to database
      const result = await dispatch(addNewProduct(productData)).unwrap();
      
      if (result?.success) {
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl('');
        
        toast.success('Product added successfully', {
          duration: 3000,
        });
        
        // Optionally navigate back to products list
        navigate('/admin/products');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product', {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      setImageLoadingState(false);
    }
  };

  useEffect(()=>{
    dispatch(fetchAllProducts())
  },[dispatch])

  console.log(productList,'productList')

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className={formStyles.formContainer}>
        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Product Image</h3>
            <ImageUpload 
              value={imageFile}
              onChange={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
              className="w-full"
            />
          </div>
          
          <div className={formStyles.formGrid}>
            {addProductFormElements.map((controlItem) => (
              <div key={controlItem.name} className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>
                  {controlItem.label}
                  {controlItem.required && <span className="text-red-500">*</span>}
                </label>
                {controlItem.componentType === 'input' && (
                  <input
                    type={controlItem.type || 'text'}
                    className={formStyles.formInput}
                    placeholder={controlItem.placeholder || ''}
                    value={formData[controlItem.name] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [controlItem.name]: e.target.value
                    }))}
                  />
                )}
                {controlItem.componentType === 'textarea' && (
                  <textarea
                    className={formStyles.formTextarea}
                    placeholder={controlItem.placeholder || ''}
                    value={formData[controlItem.name] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [controlItem.name]: e.target.value
                    }))}
                  />
                )}
                {controlItem.componentType === 'select' && (
                  <select
                    className={formStyles.formSelect}
                    value={formData[controlItem.name] || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [controlItem.name]: e.target.value
                    }))}
                  >
                    <option value="">Select {controlItem.label}</option>
                    {controlItem.options?.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            
            <div className={formStyles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <button 
                type="submit" 
                className={`${formStyles.submitButton} ${(isLoading || imageLoadingState) ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading || imageLoadingState}
              >
                {isLoading || imageLoadingState ? 'Processing...' : 'Add Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
