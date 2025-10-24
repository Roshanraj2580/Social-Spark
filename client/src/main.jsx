import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { Provider } from 'react-redux'
import { store } from './app/store.js'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_your_key_here'

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'pk_test_your_key_here') {
  console.error('Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <BrowserRouter>
     <Provider store={store}>
        <App />
     </Provider>  
    </BrowserRouter>    
  </ClerkProvider>
)
