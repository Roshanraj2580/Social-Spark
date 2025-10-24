# Social Spark 🌟

A modern, full-stack social media platform built with React, Node.js, and MongoDB.

## 🚀 Features

- **🔐 Authentication**: Secure user authentication with Clerk
- **📱 Responsive Design**: Mobile-first responsive UI
- **🎨 Modern UI**: Beautiful interface with Tailwind CSS
- **📝 Posts & Stories**: Create and share posts and stories
- **💬 Comments & Likes**: Interact with posts through comments and likes
- **👥 User Discovery**: Find and connect with other users
- **📨 Real-time Messaging**: Live chat functionality
- **🔔 Notifications**: Real-time notifications
- **📸 Image Upload**: Upload and share images with ImageKit
- **🌐 Social Features**: Follow, unfollow, and connect with users

## 🛠️ Tech Stack

### Frontend
- **React 19** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Redux Toolkit** - State management
- **Clerk** - Authentication
- **Axios** - HTTP client
- **React Router** - Routing
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk** - Authentication
- **ImageKit** - Image storage and optimization
- **Multer** - File upload handling
- **Inngest** - Background job processing
- **Nodemailer** - Email notifications

## 📁 Project Structure

```
social-spark-full-stack/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   ├── api/           # API configuration
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── configs/          # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Clerk account for authentication
- ImageKit account for image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-spark-full-stack
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   **Server Environment (`server/.env`)**:
   ```env
   MONGODB_URL=mongodb://localhost:27017
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   SENDER_EMAIL=your_email
   FRONTEND_URL=http://localhost:5173
   ```

   **Client Environment (`client/.env`)**:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BASEURL=http://localhost:4000
   ```

4. **Start the application**
   
   **Terminal 1 - Start the server**:
   ```bash
   cd server
   npm run server
   ```
   
   **Terminal 2 - Start the client**:
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📱 Usage

1. **Sign Up/Login**: Create an account or login using Clerk authentication
2. **Create Posts**: Share text posts and images
3. **Upload Stories**: Share temporary stories
4. **Discover Users**: Find and connect with other users
5. **Messaging**: Send real-time messages to connected users
6. **Interact**: Like, comment, and share posts

## 🔧 Available Scripts

### Server
- `npm run server` - Start development server with nodemon
- `npm start` - Start production server

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular social media platforms
- Thanks to all the open-source libraries and tools used

---

**Social Spark** - Connect, Share, and Spark conversations! 🌟
