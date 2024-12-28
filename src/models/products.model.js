import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Removes leading/trailing spaces
          },
          description: {
            type: String,
            trim: true,
          },
          price: {
            type: Number,
            required: true,
            min: 0, // Ensure price is non-negative
          },
          category: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Other'], // Define allowed categories
          },
          stock: {
            type: Number,
            required: true,
            min: 0, // Ensure stock is non-negative
            default: 0,
          },
          image: {
            type: String, // URL or file path to product image
            required : true
          },
    },{timestamps : true}
);

export const Product = mongoose.model("Product",productSchema);