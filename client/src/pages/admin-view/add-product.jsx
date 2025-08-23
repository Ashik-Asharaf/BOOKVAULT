import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { addProductFormElements } from "@/config";
import ImageUpload from "@/components/ui/image-upload";
import formStyles from "./productForm.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts, editProduct, setFormData } from "@/store/admin/products-slice";
import toast from "react-hot-toast";
import axios from "axios";

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
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!productId);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!productId);
  
  // Fetch product data when in edit mode
  useEffect(() => {
    let isMounted = true;
    
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        console.log('Fetching product with ID:', productId);
        const response = await axios.get(`http://localhost:5000/api/admin/products/get/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (isMounted) {
          const { data } = response;
          console.log('Fetched product data:', data);
          
          if (data.success && data.data) {
            const product = data.data;
            const updatedFormData = {
              title: product.title || '',
              description: product.description || '',
              category: product.category || '',
              brand: product.brand || '',
              price: product.price?.toString() || '',
              salePrice: product.salePrice?.toString() || '',
              totalStock: product.totalStock?.toString() || '',
              image: product.image || null
            };
            
            console.log('Setting form data:', updatedFormData);
            setFormData(updatedFormData);
            
            if (product.image) {
              console.log('Setting image URL:', product.image);
              setUploadedImageUrl(product.image);
            }
            
            // Dispatch the form data to Redux store
            dispatch(setFormData(updatedFormData));
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error(error.response?.data?.message || 'Failed to load product data');
      } finally {
        if (isMounted) {
          setIsLoadingProduct(false);
        }
      }
    };
    
    if (productId) {
      console.log('Product ID detected, fetching product data...');
      setIsLoadingProduct(true);
      fetchProduct();
    } else {
      // Reset form when not in edit mode
      setFormData(initialFormData);
      setUploadedImageUrl('');
      setImageFile(null);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (!productId) {
        setFormData(initialFormData);
        setUploadedImageUrl('');
        setImageFile(null);
      }
    };
  }, [productId, dispatch]);

  // Reset form when leaving the page or when edit mode changes
  useEffect(() => {
    return () => {
      // Only reset if we're not in edit mode
      if (!isEditMode) {
        setFormData(initialFormData);
        setUploadedImageUrl('');
        setImageFile(null);
      }
    };
  }, [isEditMode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || imageLoadingState) return;
    
    setIsLoading(true);
    
    try {
      // First upload the image to Cloudinary if a new image is selected
      let imageUrl = uploadedImageUrl || formData.image;
      
      if (imageFile) {
        setImageLoadingState(true);
        const uploadFormData = new FormData();
        uploadFormData.append('my_file', imageFile);
        
        // Upload to our server endpoint which will handle Cloudinary upload
        const uploadResponse = await fetch('http://localhost:5000/api/admin/products/upload-image', {
          method: 'POST',
          body: uploadFormData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          throw new Error('Failed to upload image');
        }
        
        imageUrl = uploadData.result.secure_url;
        setUploadedImageUrl(imageUrl);
        setImageLoadingState(false);
      }
      
      // Prepare product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
        totalStock: Number(formData.totalStock),
        image: imageUrl || null
      };

      // Remove any empty or null fields
      Object.keys(productData).forEach(key => {
        if (productData[key] === '' || productData[key] === null) {
          delete productData[key];
        }
      });
      
      let result;
      if (isEditMode && productId) {
        // Update existing product
        result = await dispatch(editProduct({ 
          id: productId, 
          data: productData 
        })).unwrap();
      } else {
        // Add new product
        result = await dispatch(addNewProduct(productData)).unwrap();
      }
      
      if (result?.success) {
        // Reset form and state
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl('');
        setCurrentEditedId(null);
        
        // Clear the form data from Redux store
        dispatch(setFormData(initialFormData));
        
        // Refresh the products list
        await dispatch(fetchAllProducts());
        
        toast.success(`Product ${isEditMode ? 'updated' : 'added'} successfully`, {
          duration: 3000,
        });
        
        // Navigate back to products list
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

  // Loading state for the form
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Loading Product...</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log(productList,'productList')

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
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
