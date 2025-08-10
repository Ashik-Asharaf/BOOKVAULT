const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async(req,res) => {
    try{

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = "data:" + req.file.mimetype + ";base64," + b64;
        const result = await imageUploadUtil(url);

        res.json({
            success : true,
            result ,
        })
    }
    catch(error) {
        console.log(error);
        res.json({
            success : false,
            message : 'error occured ',
        })
    }
}

//add product

const addProduct = async(req,res)=>{
    try {

        const {image,title,description,category,brand,price,salePrice,totalStock} = req.body;
        const newlyCreatedProduct = new Product ({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        })

        await newlyCreatedProduct.save();
        res.status(201).json({
            success : true,
            //message : 'Product added successfully',
            data : newlyCreatedProduct
        })
    }
    catch(e)      
        {
            console.log(e)
            res.status(500).json({
                success : false,
                message : 'error occured ',
            })
    }
}



//fetch product

const fetchAllProducts = async(req,res)=>{
    try {
        const listOfProducts = await Product.find();
        res.status(200).json({
            success : true,
            //message : 'Products fetched successfully',
            data : listOfProducts
        })
    }
    catch(e)      
        {
            console.log(e)
            res.status(500).json({
                success : false,
                message : 'error occured ',
            })
    }
}

//edit product

const editProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        const {image,
            title,
            description,
            category,
            brand,
            price,salePrice
            ,totalStock
        } = req.body;
const findProduct = await Product.findById(id);
if(!findProduct){
    return res.status(404).json({
        success : false,
        message : 'Product not found'
    });

}

findProduct.title = title || findProduct.title
findProduct.description = description || findProduct.description
findProduct.category = category || findProduct.category
findProduct.brand = brand || findProduct.brand
findProduct.price = price || findProduct.price
findProduct.salePrice = salePrice || findProduct.salePrice
findProduct.totalStock = totalStock || findProduct.totalStock
findProduct.image = image || findProduct.image

await findProduct.save();

res.status(200).json({
    success : true,
    // message : 'Product updated successfully',
    data : findProduct
});
}
    catch(e)      
        {
            console.log(e)
            res.status(500).json({
                success : false,
                message : 'error occured ',
            })
    }
}

//delete product

const deleteProduct = async(req,res)=>{
    try {

        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id);
        if(!product){
            return res.status(404).json({
                success : false,
                message : 'Product not found'
            });
        }

       // await //product.remove();

        res.status(200).json({
            success : true,
            message : 'Product deleted successfully',
            data : product
        });

    }
    catch(e)      
        {
            console.log(e)
            res.status(500).json({
                success : false,
                message : 'error occured ',
            })
    }
}

module.exports= {handleImageUpload,addProduct,fetchAllProducts,editProduct,deleteProduct}