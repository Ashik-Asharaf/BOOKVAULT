const mangoose = require('mongoose')

const ProductSchema = new mangoose.Schema({
    image : String,
    title: String,
    description : String,
    category : String,
    brand : String,
    price : Number,
    salePrice : Number,
    totalStock : Number,
}, {
    timestamps : true
})

module.exports = mongoose.model('Product', ProductSchema)