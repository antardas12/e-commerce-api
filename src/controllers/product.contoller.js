import { application, response } from "express";
import { Product } from "../models/products.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteImageFromCloudinary } from "../utils/deleteOnCloudinary.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, stock } = req.body;

    if ([name, description, price, category, stock].some((field) => !field.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const imagelocalPath = req.file?.path; // Add nullish check for req.file
    if (!imagelocalPath) {
        throw new ApiError(400, "Product image is required");
    }

    const image = await uploadOnCloudinary(imagelocalPath);
    if (!image) {
        throw new ApiError(400, "Error uploading image to Cloudinary");
    }

    const product = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        image: image.url
    });



    // Get the created product with all details
    const createdProduct = await Product.findById(product._id);
    if (!createdProduct) {
        throw new ApiError(500, "something wrong while create product ")
    }

    return res.status(200).json(
        new ApiResponse(200, "Product created successfully", createdProduct)
    );
});


const getAllProduct = asyncHandler(async (req, res) => {
    const allProduct = await Product.find({})
    if (allProduct.length === 0) {
        throw new ApiError(404, "product not found")
    }
    console.log(allProduct)
    res.status(200)
        .json(
            new ApiResponse(200, "get product successfully", allProduct)
        )
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock, category } = req.body;

    // Fixing typo 'fild' to 'field' and checking for empty fields
    if ([name, price, description, stock, category].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const imagelocalPath = req.file?.path; // Ensure that 'req.file' exists
    if (!imagelocalPath) {
        throw new ApiError(400, "Image is required");
    }

    // Upload image to Cloudinary
    const image = await uploadOnCloudinary(imagelocalPath);
    if (!image) {
        throw new ApiError(400, "Error while uploading image to Cloudinary");
    }

    // Find product to update
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const oldImageUrl = product.image;
    const oldPublicId = oldImageUrl ? oldImageUrl.split('/').pop().split('.')[0] : null; // Extract public_id

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, {
        $set: {
            name: name,
            description: description,
            stock: stock,
            price: price,
            category: category,
            image: image.url // Store the new image URL
        }
    }, {
        new: true
    });

    // Delete the old image from Cloudinary
    if (oldPublicId) {
       await deleteImageFromCloudinary(oldPublicId);
        
    }

    return res.status(200).json(
        new ApiResponse(200, "Product updated successfully", updatedProduct)
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    
    const product = await Product.findById(id);
    
   
    if (!product) {
       throw new ApiError(404,"product font found")
    }

   
    const oldImageUrl = product.image;
    const oldPublicId = oldImageUrl ? oldImageUrl.split('/').pop().split('.')[0] : null;

    // Delete the product from the database
    await Product.findByIdAndDelete(id);

    // If an image was associated with the product, delete it from Cloudinary
    if (oldPublicId) {
        await deleteImageFromCloudinary(oldPublicId);
    }

    // Respond with a success message
  return res.status(200).json(
    new ApiResponse(200,"product delate succssfully ",{})
  )
});




export {
    createProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}