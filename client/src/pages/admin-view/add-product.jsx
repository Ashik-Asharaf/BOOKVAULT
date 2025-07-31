import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { addProductFormElements } from "@/config";
import ImageUpload from "@/components/ui/image-upload";
import formStyles from "./productForm.module.css";

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
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, image: imageFile });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className={formStyles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Product Image</h3>
            <ImageUpload 
              value={imageFile}
              onChange={setImageFile}
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
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
            
            <div className={formStyles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className={formStyles.submitButton}>
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
