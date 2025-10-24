import React, { useEffect, useState } from 'react'
import { dummyConnectionsData } from '../assets/assets'
import { Search, Users, Sparkles, TrendingUp } from 'lucide-react'
import UserCard from '../components/UserCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const Discover = () => {

  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const handleSearch = async (e) => {
    if(e.key === 'Enter'){
      try {
        setUsers([])
        setLoading(true)
        const { data } = await api.post('/api/user/discover', {input}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'>
      <div className='max-w-7xl mx-auto p-6'>
        
        {/* Header Section */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <Sparkles className='w-4 h-4'/>
            Discover Amazing People
          </div>
          <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4'>
            Find Your Spark
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Connect with inspiring people, discover new perspectives, and grow your network on Social Spark
          </p>
        </div>

        {/* Search Section */}
        <div className='mb-12'>
          <div className='max-w-2xl mx-auto'>
            <div className='relative group'>
              <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000'></div>
              <div className='relative bg-white rounded-2xl shadow-xl border border-gray-100 p-2'>
                <div className='flex items-center gap-3 p-4'>
                  <Search className='w-6 h-6 text-purple-500' />
                  <input 
                    type="text" 
                    placeholder='Search by name, username, bio, or location...' 
                    className='flex-1 text-lg border-none outline-none bg-transparent placeholder-gray-400' 
                    onChange={(e)=>setInput(e.target.value)} 
                    value={input} 
                    onKeyUp={handleSearch}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Users className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>12K+</h3>
            <p className='text-gray-600'>Active Users</p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <TrendingUp className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>50K+</h3>
            <p className='text-gray-600'>Connections Made</p>
          </div>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center'>
            <div className='w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Sparkles className='w-6 h-6 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>100+</h3>
            <p className='text-gray-600'>Countries</p>
          </div>
        </div>

        {/* Results Section */}
        {users.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>
              Search Results ({users.length})
            </h2>
          </div>
        )}

        {/* Users Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {users.map((user)=>(
            <UserCard user={user} key={user._id}/>
          ))}
        </div>

        {/* Empty State */}
        {!loading && users.length === 0 && input === '' && (
          <div className='text-center py-16'>
            <div className='w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Search className='w-12 h-12 text-purple-500' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>Start Discovering</h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Search for people by name, username, bio, or location to find amazing connections
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && users.length === 0 && input !== '' && (
          <div className='text-center py-16'>
            <div className='w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6'>
              <Search className='w-12 h-12 text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No Results Found</h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Try searching with different keywords or check your spelling
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && <Loading height='60vh'/>}

      </div>
    </div>
  )
}

export default Discover
