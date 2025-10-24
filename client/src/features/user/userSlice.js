import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'


const initialState = {
    value: null,
    loading: false,
    error: null
}

export const fetchUser = createAsyncThunk('user/fetchUser', async ({token, clerkUser}) => {
    try {
        const { data } = await api.get('/api/user/data', {
            headers: {Authorization: `Bearer ${token}`}
        })
        
        if (data.success) {
            return data.user
        } else if (data.message === "User not found") {
            // If user doesn't exist, create them using Clerk user data
            if (clerkUser) {
                const createPayload = {
                    data: {
                        id: clerkUser.id,
                        email_addresses: clerkUser.emailAddresses,
                        first_name: clerkUser.firstName || '',
                        last_name: clerkUser.lastName || '',
                        image_url: clerkUser.imageUrl || ''
                    }
                }
                
                const { data: createData } = await api.post('/api/user/create', createPayload)
                return createData.success ? createData.user : null
            }
        }
        
        return null
    } catch (error) {
        console.error('Error fetching user:', error)
        console.error('Error details:', error.response?.data || error.message)
        return null
    }
})

export const updateUser = createAsyncThunk('user/update', async ({userData ,token}) => {
    const { data } = await api.post('/api/user/update', userData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if(data.success){
        toast.success(data.message)
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchUser.pending, (state)=>{
            state.loading = true
            state.error = null
        })
        .addCase(fetchUser.fulfilled, (state, action)=>{
            state.loading = false
            state.value = action.payload
            state.error = null
        })
        .addCase(fetchUser.rejected, (state, action)=>{
            state.loading = false
            state.error = action.error.message
            console.error('fetchUser rejected:', action.error)
        })
        .addCase(updateUser.fulfilled, (state, action)=>{
            state.value = action.payload
        })
    }
})

export default userSlice.reducer