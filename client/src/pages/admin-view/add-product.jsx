import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { addProductFormElements } from "@/config";
import ImageUpload from "@/components/ui/image-upload";
import formStyles from "./productForm.module.css";
import { useDispatch,useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts, editProduct } from "@/store/admin/products-slice"
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
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('edit');
  const [isEditMode, setIsEditMode] = useState(!!productId);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!productId);
  const [forceUpdate, setForceUpdate] = useState(false);
  
  // Fetch product data when in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        console.log('Fetching product with ID:', productId);
        const response = await fetch(`http://localhost:5000/api/admin/products/get/${productId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log('Product data received:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch product');
        }
        
        if (data.success && data.data) {
          const product = data.data;
          console.log('Setting form data with product:', product);
          
          const formData = {
            title: product.title || '',
            description: product.description || '',
            category: product.category || '',
            brand: product.brand || '',
            price: product.price?.toString() || '',
            salePrice: product.salePrice?.toString() || '',
            totalStock: product.totalStock?.toString() || '',
            image: product.image || null
          };
          
          console.log('Form data to be set:', formData);
          setFormData(formData);
          
          if (product.image) {
            setUploadedImageUrl(product.image);
          }
          
          // Force a re-render to ensure form fields are updated
          setForceUpdate(prev => !prev);
        } else {
          console.error('No product data found in response');
          toast.error('Product data not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error(`Failed to load product data: ${error.message}`);
      } finally {
        setIsLoadingProduct(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Reset form when unmounting or when productId changes
  useEffect(() => {
    return () => {
      // Only reset if we're not in edit mode
      if (!productId) {
        setFormData(initialFormData);
        setUploadedImageUrl('');
        setImageFile(null);
      }
    };
  }, [productId]);

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
      if (isEditMode && productToEdit?._id) {
        // Update existing product
        result = await dispatch(editProduct({ 
          id: productToEdit._id, 
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

  // Show loading state while fetching product data
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

  // Debug log current form data
  console.log('Current form data:', formData);

  // Render form fields based on addProductFormElements config
  const renderFormField = (controlItem) => {
    const value = formData[controlItem.name] || '';
    
    const commonProps = {
      key: controlItem.name,
      className: formStyles[`form${controlItem.componentType === 'textarea' ? 'Textarea' : 'Input'}`],
      placeholder: controlItem.placeholder || '',
      value: value,
      onChange: (e) => {
        setFormData(prev => ({
          ...prev,
          [controlItem.name]: e.target.value
        }));
      },
      required: controlItem.required
    };

    return (
      <div key={controlItem.name} className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>
          {controlItem.label}
          {controlItem.required && <span className="text-red-500">*</span>}
        </label>
        {controlItem.componentType === 'input' && (
          <input
            type={controlItem.type || 'text'}
            {...commonProps}
          />
        )}
        
        {controlItem.componentType === 'textarea' && (
          <textarea {...commonProps} rows="4" />
        )}
        
        {controlItem.componentType === 'select' && (
          <select {...commonProps}>
            <option value="">Select {controlItem.label}</option>
            {controlItem.options?.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
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
            {addProductFormElements.map(renderFormField)}
          </div>
          
          <div className="mt-8 flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={isLoading || imageLoadingState}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || imageLoadingState}
            >
              {isLoading || imageLoadingState ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </span>
              ) : isEditMode ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
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
