import React, { Fragment, useState } from "react";
import { Button } from "../ui/button";
import styles from "./adminView.module.css";
import formStyles from "./productForm.module.css";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { addProductFormElements } from "@/config";
import CommonForm from "@/components/common/form";
//import initialFormdata from "./initialFormdata";
//import setOpen from "./setOpen"

const initialFormData={
    image : null,
    title : '',
    description : '',
    category : '',
    brand : '',
    price : "",
    salePrice : '',
    totalStock : ''

}

function AdminProducts() {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);

    const [formData,setFormData] = useState(initialFormData)

    function onSubmit(formData){
    }

    return <Fragment>
        <div className={styles.addButton}>
            <Button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</Button>
        </div>
        <div className={styles.tableContainer}>
            <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
                <SheetContent 
                    side="right" 
                    className={`w-[300px] sm:w-[600px] p-0 relative`}
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        height: '100vh',
                        transform: openCreateProductsDialog ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s ease-in-out',
                        padding: 0,
                    }}
                >
                    <div className="relative h-full overflow-y-auto">
                        <div className="sticky top-0 z-40 bg-background border-b p-6">
                            <SheetHeader className="relative">
                                <SheetTitle className="text-2xl font-bold">Add New Product</SheetTitle>
                                <p className="text-sm text-muted-foreground">
                                    Add a new product to your store
                                </p>
                            </SheetHeader>
                        </div>
                        <div className={formStyles.formContainer}>
                            <div className={formStyles.formGrid}>
                                {addProductFormElements.map((controlItem) => (
                                    <div key={controlItem.name} className={formStyles.formGroup}>
                                        <label className={formStyles.formLabel}>
                                            {controlItem.label}
                                            {controlItem.required && <span style={{color: 'red'}}>*</span>}
                                        </label>
                                        {controlItem.componentType === 'input' && (
                                            <input
                                                type={controlItem.type || 'text'}
                                                className={formStyles.formInput}
                                                placeholder={controlItem.placeholder || ''}
                                                value={formData[controlItem.name] || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    [controlItem.name]: e.target.value
                                                })}
                                            />
                                        )}
                                        {controlItem.componentType === 'textarea' && (
                                            <textarea
                                                className={formStyles.formTextarea}
                                                placeholder={controlItem.placeholder || ''}
                                                value={formData[controlItem.name] || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    [controlItem.name]: e.target.value
                                                })}
                                            />
                                        )}
                                        {controlItem.componentType === 'select' && (
                                            <select
                                                className={formStyles.formSelect}
                                                value={formData[controlItem.name] || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    [controlItem.name]: e.target.value
                                                })}
                                            >
                                                <option value="">Select {controlItem.label}</option>
                                                {controlItem.options.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    className={formStyles.submitButton}
                                    onClick={() => onSubmit(formData)}
                                >
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </Fragment>
}

export default AdminProducts;