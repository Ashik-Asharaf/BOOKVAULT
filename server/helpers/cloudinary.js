const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
    cloud_name : 'dlmvlddlu',
    api_key : '737119693632743',
    api_secret : 'PFMF-oPOGDnr5Z3ARi24XM6-6ek'
});

const storage =new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file,{
        resource_type : 'auto'
    });
    return result;
}

const upload = multer({storage})

module.exports={upload,imageUploadUtil };