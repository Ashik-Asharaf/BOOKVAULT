import React, { useEffect, useRef } from "react";
import { Button } from "../../pages/ui/button";
import { Input } from "../../pages/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XIcon } from "lucide-react";
import axios from "axios";

function ProductImageUpload(props) {
  // Destructure and keep internal props separate
  const {
    value: imageFile,
    onChange: setImageFile,
    uploadedImageUrl,
    setUploadedImageUrl,
    imageLoadingState,
    setImageLoadingState,
    className,
    ...rest // any other props that might come in
  } = props;

  const inputRef = useRef(null);

  function handleImageChange(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImageFile(selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      setImageFile(droppedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImageUrl(reader.result);
      };
      reader.readAsDataURL(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }

  async function uploadImagetoCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append('my_file', imageFile);
    const response = await axios.post(
      'http://localhost:5000/api/admin/add-products/upload-image',
      data
    );

    if (response.data?.success) {
      setUploadedImageUrl(response.data.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImagetoCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <label className="text-lg font-semibold mb-2">Upload Image</label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-blue-500"
      >
        {/* Only pass valid HTML props to Input */}
        <Input
          type="file"
          id="image-upload"
          className={`hidden ${className || ''}`}
          ref={inputRef}
          onChange={handleImageChange}
          accept="image/*"
          {...rest} // rest won't include the custom props now
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-full cursor-pointer border-2 border-dashed rounded-lg p-6 transition-colors hover:border-blue-500"
          >
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & Drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <div className="h-10 bg-gray-100 rounded animate-pulse"></div>
        ) : (
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
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;