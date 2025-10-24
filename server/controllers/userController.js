import imagekit from "../configs/imageKit.js"
import { inngest } from "../inngest/index.js"
import Connection from "../models/Connection.js"
import Post from "../models/Post.js"
import User from "../models/User.js"
import fs from 'fs'
import { clerkClient } from "@clerk/express";


// Create User (for Clerk webhook)
export const createUser = async (req, res) => {
    try {
        const { id, email_addresses, first_name, last_name, image_url } = req.body.data;
        
        if (!id) {
            return res.json({ success: false, message: "User ID is required" });
        }
        
        // Check if user already exists
        const existingUser = await User.findById(id);
        if (existingUser) {
            return res.json({ success: true, user: existingUser, message: "User already exists" });
        }

        // Create new user with fallback values
        const email = email_addresses?.[0]?.email_address || 'no-email@example.com';
        const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
        
        // Generate a better username
        let username;
        if (email && email !== 'no-email@example.com') {
            username = email.split('@')[0] + '_' + id.slice(-4);
        } else if (fullName && fullName !== 'User') {
            // Use first name + last 4 chars of ID
            const firstName = fullName.split(' ')[0].toLowerCase();
            username = firstName + '_' + id.slice(-4);
        } else {
            // Fallback to user + last 4 chars of ID
            username = 'user_' + id.slice(-4);
        }

        const newUser = await User.create({
            _id: id,
            email: email,
            full_name: fullName,
            profile_picture: image_url || '',
            username: username
        });

        console.log('User created successfully:', newUser._id);
        res.json({ success: true, user: newUser, message: "User created successfully" });
    } catch (error) {
        console.error('Error creating user:', error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Data using userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        const user = await User.findById(userId)
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        res.json({success: true, user})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

//  Update User Data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth()
        let {username, bio, location, full_name } = req.body;

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username)

        if(tempUser.username !== username){
            const user = await User.findOne({username})
            if(user){
                // we will not change the username if it is already taken
                username = tempUser.username
            }
        }

        const updatedData = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            if(imagekit) {
                const buffer = fs.readFileSync(profile.path)
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: profile.originalname,
                })

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        {quality: 'auto'},
                        { format: 'webp' },
                        { width: '512' }
                    ]
                })
                updatedData.profile_picture = url;

                const blob = await fetch(url).then(res => res.blob());
                await clerkClient.users.updateUserProfileImage(userId, { file: blob });
            } else {
                console.log('ImageKit not configured - skipping profile picture upload');
            }
        }

        if(cover){
            if(imagekit) {
                const buffer = fs.readFileSync(cover.path)
                const response = await imagekit.upload({
                    file: buffer,
                    fileName: cover.originalname,
                })

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        {quality: 'auto'},
                        { format: 'webp' },
                        { width: '1280' }
                    ]
                })
                updatedData.cover_photo = url;
            } else {
                console.log('ImageKit not configured - skipping cover photo upload');
            }
        }

        const user = await User.findByIdAndUpdate(userId, updatedData, {new : true})

        res.json({success: true, user, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Find Users using username, email, location, name
export const discoverUsers = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { input } = req.body;

        const allUsers = await User.find(
            {
                $or: [
                    {username: new RegExp(input, 'i')},
                    {email: new RegExp(input, 'i')},
                    {full_name: new RegExp(input, 'i')},
                    {location: new RegExp(input, 'i')},
                ]
            }
        )
        const filteredUsers = allUsers.filter(user=> user._id !== userId);

        res.json({success: true, users: filteredUsers})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Follow User
export const followUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const user = await User.findById(userId)

        if(user.following.includes(id)){
            return res.json({ success: false, message: 'You are already following this user'})
        }

        user.following.push(id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        res.json({success: true, message: 'Now you are following this user'})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Unfollow User
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { id } = req.body;

        const user = await User.findById(userId)
        user.following = user.following.filter(user=> user !== id);
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(user=> user !== userId);
        await toUser.save()
        
        res.json({success: true, message: 'You are no longer following this user'})
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Send Connection Request
export const sendConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth()
        const { id } = req.body;

        // Check if user has sent more than 20 connection requests in the last 24 hours
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const connectionRequests = await Connection.find({from_user_id: userId, created_at: { $gt: last24Hours }})
        if(connectionRequests.length >= 20){
            return res.json({success: false, message: 'You have sent more than 20 connection requests in the last 24 hours'})
        }

        // Check if users are already conected
        const connection = await Connection.findOne({
            $or: [
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId},
            ]
        })

        if(!connection){
           const newConnection = await Connection.create({
                from_user_id: userId,
                to_user_id: id
            })

            await inngest.send({
                name: 'app/connection-request',
                data: {connectionId: newConnection._id}
            })

            return res.json({success: true, message: 'Connection request sent successfully'})
        }else if(connection && connection.status === 'accepted'){
            return res.json({success: false, message: 'You are already connected with this user'})
        }

        return res.json({success: false, message: 'Connection request pending'})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Get User Connections
export const getUserConnections = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers following')

        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pendingConnections = (await Connection.find({to_user_id: userId, status: 'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id)

        res.json({success: true, connections, followers, following, pendingConnections})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

// Accept Connection Request
export const acceptConnectionRequest = async (req, res) => {
    try {
        const {userId} = req.auth()
        const { id } = req.body;

        const connection = await Connection.findOne({from_user_id: id, to_user_id: userId})

        if(!connection){
            return res.json({ success: false, message: 'Connection not found' });
        }

        const user = await User.findById(userId);
        user.connections.push(id);
        await user.save()

        const toUser = await User.findById(id);
        toUser.connections.push(userId);
        await toUser.save()

        connection.status = 'accepted';
        await connection.save()

        res.json({ success: true, message: 'Connection accepted successfully' });

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}


// Get User Profiles
export const getUserProfiles = async (req, res) =>{
    try {
        const { profileId } = req.body;
        const profile = await User.findById(profileId)
        if(!profile){
            return res.json({ success: false, message: "Profile not found" });
        }
        const posts = await Post.find({user: profileId}).populate('user')

        res.json({success: true, profile, posts})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}