import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({post}) => {

    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likes, setLikes] = useState(post.likes_count)
    const [commentsCount, setCommentsCount] = useState(post.comments ? post.comments.length : 0)
    const [shares, setShares] = useState(post.shares_count || 0)
    const [newComment, setNewComment] = useState("")
    const currentUser = useSelector((state) => state.user.value)

    const { getToken } = useAuth()

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/api/post/like`, {postId: post._id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if (data.success){
               toast.success(data.message) 
               setLikes(prev =>{
                if(prev.includes(currentUser._id)){
                    return prev.filter(id=> id !== currentUser._id)
                }else{
                    return [...prev, currentUser._id]
                }
               })
            }else{
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const navigate = useNavigate()

    const handleAddComment = async () =>{
        if(!newComment.trim()) return
        try {
            const { data } = await api.post('/api/post/comment', {
                postId: post._id, 
                text: newComment.trim()
            }, {
                headers: { 
                    Authorization: `Bearer ${await getToken()}`
                }
            })
            if(data.success){
                setCommentsCount(data.comments.length)
                setNewComment("")
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Comment error:', error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    const handleShare = async () =>{
        try {
            const { data } = await api.post('/api/post/share', {postId: post._id}, {headers: { Authorization: `Bearer ${await getToken()}` }})
            if(data.success){
                toast.success('Post link copied')
                setShares(data.shares)
                await navigator.clipboard.writeText(window.location.origin + '/profile/' + post.user._id)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* User Info */}
        <div onClick={()=> navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
            <img src={post.user.profile_picture} alt="" className='w-10 h-10 rounded-full shadow'/>
            <div>
                <div className='flex items-center space-x-1'>
                    <span>{post.user.full_name}</span>
                    <BadgeCheck className='w-4 h-4 text-blue-500'/>
                </div>
                <div className='text-gray-500 text-sm'>@{post.user.username || post.user.full_name?.toLowerCase().replace(/\s+/g, '_') || 'user'} • {moment(post.createdAt).fromNow()}</div>
            </div>
        </div>
         {/* Content */}
         {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html: postWithHashtags}}/>}

       {/* Images */}
       <div className='grid grid-cols-2 gap-2'>
            {post.image_urls.map((img, index)=>(
                <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt="" />
            ))}
       </div>

        {/* Actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1'>
                <Heart className={`w-4 h-4 cursor-pointer ${likes.includes(currentUser._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike}/>
                <span>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1'>
                <MessageCircle className="w-4 h-4 cursor-pointer" onClick={()=> document.getElementById('cmt-' + post._id)?.focus()}/>
                <span>{commentsCount}</span>
            </div>
            <div className='flex items-center gap-1'>
                <Share2 className="w-4 h-4 cursor-pointer" onClick={handleShare}/>
                <span>{shares}</span>
            </div>

        </div>

        {/* Add Comment */}
        <div className='flex items-center gap-2'>
            <input id={'cmt-' + post._id} value={newComment} onChange={(e)=> setNewComment(e.target.value)} placeholder='Write a comment...' className='flex-1 border rounded px-3 py-2 text-sm'/>
            <button onClick={handleAddComment} className='px-3 py-2 text-sm bg-indigo-600 text-white rounded'>Comment</button>
        </div>


    </div>
  )
}

export default PostCard
