import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images = req.files

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path)
                     const response = await imagekit.upload({
                            file: fileBuffer,
                            fileName: image.originalname,
                            folder: "posts",
                        })

                        const url = imagekit.url({
                            path: response.filePath,
                            transformation: [
                                {quality: 'auto'},
                                { format: 'webp' },
                                { width: '1280' }
                            ]
                        })
                        return url
                })
            )
        }

        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        res.json({ success: true, message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Posts
export const getFeedPosts = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)

        // User connections and followings 
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await Post.find({user: {$in: userIds}}).populate('user').sort({createdAt: -1});

        res.json({ success: true, posts})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Like Post
export const likePost = async (req, res) =>{
    try {
        const { userId } = req.auth()
        const { postId } = req.body;

        const post = await Post.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save()
            res.json({ success: true, message: 'Post unliked' });
        }else{
            post.likes_count.push(userId)
            await post.save()
            res.json({ success: true, message: 'Post liked' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Add Comment
export const addComment = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { postId, text } = req.body

        if(!text || !text.trim()){
            return res.json({success: false, message: 'Comment cannot be empty'})
        }

        const post = await Post.findById(postId)
        if(!post){
            return res.json({success: false, message: 'Post not found'})
        }

        post.comments.push({ user: userId, text: text.trim() })
        await post.save()

        const populated = await Post.findById(postId).populate('comments.user', 'full_name username profile_picture')
        res.json({success: true, message: 'Comment added', comments: populated.comments})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Comments
export const getComments = async (req, res) => {
    try {
        const { postId } = req.params
        const post = await Post.findById(postId).populate('comments.user', 'full_name username profile_picture')
        if(!post){
            return res.json({success: false, message: 'Post not found'})
        }
        res.json({success: true, comments: post.comments})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Increment share count
export const sharePost = async (req, res) => {
    try {
        const { postId } = req.body
        const post = await Post.findById(postId)
        if(!post){
            return res.json({success: false, message: 'Post not found'})
        }
        post.shares_count = (post.shares_count || 0) + 1
        await post.save()
        res.json({success: true, message: 'Post shared', shares: post.shares_count})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}