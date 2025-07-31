import React, { useRef } from "react";
import { Button } from "../ui/button";
import {Input} from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XIcon, FileIcon } from "lucide-react";


function ProductImageUpload({imageFile,setImageFile,uploadedImageUrl,setUploadedImageUrl}) { 
    
    const inputRef = useRef(null);
    
    function handleImageChange(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const selectedFile = files[0];
            setImageFile(selectedFile);
            // Create a preview URL for the image
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImageUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    function handleDragOver(event){
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const droppedFile = files[0];
            setImageFile(droppedFile);
            // Create a preview URL for the dropped image
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImageUrl(reader.result);
            };
            reader.readAsDataURL(droppedFile);
        }
    }

    function handleRemoveImage(){
        setImageFile(null)
        if(inputRef.current){
            inputRef.current.value = ''
        }
    }

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <label className="text-lg font-semibold mb-2">Upload Image </label>
            <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-blue-500">
                <Input 
                type="file" 
                id="image-upload" 
                // className="hidden"  
                ref={inputRef} 
                onChange={handleImageChange} 
                />
                {
                    !imageFile ? 
                    <Label htmlFor="image-upload" className="flex flex-col items-center justify-center h-full cursor-pointer border-2 border-dashed rounded-lg p-6 transition-colors hover:border-blue-500">
                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & Drop or click to uplaod image</span>
                    </Label> : <div></div>
                        
                }
                {imageFile && (
                    <div className="mt-4 p-3 border rounded-lg flex items-center justify-between bg-gray-50">
                        <div className="flex items-center">
                            <img 
                                src={URL.createObjectURL(imageFile)} 
                                alt="Preview" 
                                className="w-12 h-12 object-cover rounded mr-3"
                            />
                            <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                {imageFile.name}
                            </p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-gray-500 hover:text-red-500 hover:bg-transparent" 
                            onClick={handleRemoveImage}
                        >
                            <XIcon className="w-4 h-4"/>
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductImageUpload;
    