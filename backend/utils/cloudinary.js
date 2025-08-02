import {v2 as cloudinary} from 'cloudinary';
import {response} from 'express';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        
        // Remove the local file after uploading
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath); // Ensure the local file is deleted even if upload fails
        console.error('Error uploading to Cloudinary:', error);
        response.status(500).json({ error: 'Failed to upload image' });
    }
}

export { uploadOnCloudinary };