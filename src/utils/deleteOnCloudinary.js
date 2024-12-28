import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const deleteImageFromCloudinary = async (publicId) => {
    try {

        const result = await cloudinary.uploader.destroy(publicId);

        // if (result.result === 'ok') {
        //     // console.log('Image deleted successfully');
        // } else {
        //     console.log('Image deletion failed');
        // }
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};


export { deleteImageFromCloudinary }