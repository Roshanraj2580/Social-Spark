import React from 'react'
import { dummyUserData } from '../assets/assets'
import { MapPin, MessageCircle, Plus, UserPlus, Eye, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { fetchUser } from '../features/user/userSlice'

const UserCard = ({user}) => {

    const currentUser = useSelector((state) => state.user.value)
    const {getToken} = useAuth()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleFollow = async () => {
        try {
            const { data } = await api.post('/api/user/follow', {id: user._id}, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                dispatch(fetchUser(await getToken()))
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleConnectionRequest = async () => {
        if(currentUser.connections.includes(user._id)){
            return navigate('/messages/' + user._id)
        }

        try {
            const { data } = await api.post('/api/user/connect', {id: user._id}, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleViewProfile = () => {
        navigate('/profile/' + user._id)
    }

  return (
    <div key={user._id} className='group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden'>
      {/* Cover Photo Background */}
      <div className='h-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative'>
        <div className='absolute inset-0 bg-black bg-opacity-20'></div>
      </div>
      
      {/* Profile Section */}
      <div className='px-6 pb-6 -mt-10 relative'>
        {/* Profile Picture */}
        <div className='relative'>
          <img 
            src={user.profile_picture} 
            alt="" 
            className='w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto object-cover'
          />
          {/* Online Status Indicator */}
          <div className='absolute bottom-1 right-1/2 transform translate-x-6 w-4 h-4 bg-green-500 rounded-full border-2 border-white'></div>
        </div>
        
        {/* User Info */}
        <div className='text-center mt-4'>
          <h3 className='font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors'>
            {user.full_name}
          </h3>
          <p className='text-gray-500 text-sm font-medium'>
            @{user.username || user.full_name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
          </p>
          {user.bio && (
            <p className='text-gray-600 text-sm mt-2 line-clamp-2 px-2'>
              {user.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className='flex items-center justify-center gap-4 mt-4 text-xs text-gray-600'>
          <div className='flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5'>
            <MapPin className='w-3 h-3 text-purple-500'/> 
            <span className='font-medium'>{user.location || 'Unknown'}</span>
          </div>
          <div className='flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5'>
            <Heart className='w-3 h-3 text-red-500'/> 
            <span className='font-medium'>{user.followers?.length || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-2 mt-6'>
          {/* View Profile Button */}
          <button 
            onClick={handleViewProfile}
            className='flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2'
          >
            <Eye className='w-4 h-4'/>
            View Profile
          </button>
          
          {/* Follow Button */}
          <button 
            onClick={handleFollow} 
            disabled={currentUser?.following?.includes(user._id)} 
            className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${
              currentUser?.following?.includes(user._id) 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white'
            }`}
          >
            <UserPlus className='w-4 h-4'/> 
            {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Connection Button */}
        <div className='mt-3'>
          <button 
            onClick={handleConnectionRequest} 
            className={`w-full py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              currentUser?.connections?.includes(user._id)
                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {currentUser?.connections?.includes(user._id) ? (
              <>
                <MessageCircle className='w-4 h-4'/>
                Message
              </>
            ) : (
              <>
                <Plus className='w-4 h-4'/>
                Connect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
