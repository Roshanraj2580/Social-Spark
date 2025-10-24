import ImageKit from "imagekit";

// Only initialize ImageKit if all required environment variables are present
let imagekit = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && 
    process.env.IMAGEKIT_PRIVATE_KEY && 
    process.env.IMAGEKIT_URL_ENDPOINT &&
    process.env.IMAGEKIT_PUBLIC_KEY !== 'your_imagekit_public_key_here') {
    imagekit = new ImageKit({
        publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
    });
    console.log('ImageKit initialized successfully');
} else {
    console.log('ImageKit not configured - image uploads will be disabled');
}

export default imagekit