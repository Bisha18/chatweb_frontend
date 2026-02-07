# 💬 TalkM - Real-Time Chat Application

A modern, full-stack real-time chat application built with React and Socket.IO. TalkM enables seamless communication through instant messaging, room-based chats, and live user presence tracking with a sleek, responsive interface.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-talksyweb.vercel.app-blue?style=for-the-badge)](https://talksyweb.vercel.app)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

### 💬 Real-Time Messaging
- **Instant Message Delivery**: Messages sent and received in real-time using WebSocket technology
- **Message Acknowledgments**: Visual confirmation when messages are delivered
- **Typing Indicators**: See when other users are typing a message
- **Message History**: Persistent chat history with smooth scrolling

### 🏠 Room-Based Communication
- **Group Chats**: Create and join chat rooms for team discussions
- **Private Messaging**: One-on-one conversations with individual users
- **Room Management**: Easy navigation between different chat rooms
- **Active Room Indication**: Visual feedback for current active room

### 👥 User Presence & Activity
- **Online Status**: Real-time tracking of active users
- **User List**: View all currently online users in the chat
- **Join/Leave Notifications**: Get notified when users enter or exit rooms
- **Active User Count**: See how many people are currently online

### 🔐 Authentication & Security
- **Secure User Authentication**: Protected login and registration system
- **Session Management**: Automatic session handling for smooth user experience
- **Secure Logout**: Properly managed user disconnection
- **JWT Token Integration**: Secure token-based authentication

### 🎨 User Interface
- **Clean & Modern Design**: Intuitive interface built with modern CSS
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile
- **Message Bubbles**: Distinct visual styling for sent and received messages
- **Smooth Animations**: Polished transitions and loading states
- **Emoji Support**: Rich text messaging with emoji reactions

### 📱 Additional Features
- **Notification System**: Alerts for new messages when away
- **Offline Message Queue**: Messages stored when offline and sent when reconnected
- **Auto-Reconnection**: Automatic reconnection on connection loss
- **Scroll to Latest**: Quick navigation to the newest messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Socket.IO Client** - Real-time bidirectional communication
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with flexbox and grid

### Backend (Repository: [chatweb_backend](https://github.com/Bisha18/chatapp_backend))
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - WebSocket library for real-time features
- **MongoDB** - NoSQL database for data persistence
- **JWT** - Secure authentication tokens
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting and quality
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see [backend repository](https://github.com/Bisha18/chatweb_backend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Bisha18/chatweb_frontend.git
cd chatweb_frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

> **Note**: Replace with your backend server URL. For production, use your deployed backend URL.

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📂 Project Structure

```
chatweb_frontend/
├── public/              # Static assets
│   └── vite.svg        # App icon
├── src/
│   ├── components/     # React components
│   │   ├── Chat/      # Chat interface components
│   │   ├── Auth/      # Authentication components
│   │   ├── Sidebar/   # User list and rooms
│   │   └── Common/    # Reusable UI components
│   ├── contexts/      # React context providers
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── hooks/         # Custom React hooks
│   │   ├── useSocket.js
│   │   └── useAuth.js
│   ├── services/      # API and Socket services
│   │   ├── api.js
│   │   └── socket.js
│   ├── utils/         # Utility functions
│   ├── styles/        # CSS stylesheets
│   ├── App.jsx        # Main application component
│   └── main.jsx       # Application entry point
├── .env               # Environment variables
├── package.json       # Project dependencies
└── vite.config.js     # Vite configuration
```

## 🎯 Key Features Explained

### Real-Time Communication
TalkM uses Socket.IO to establish a persistent WebSocket connection between the client and server:
- Bi-directional communication for instant message delivery
- Event-driven architecture for efficient data transfer
- Automatic reconnection on network interruptions
- Room-based message broadcasting

### Message Flow
1. User sends a message through the UI
2. Message is emitted to the server via Socket.IO
3. Server validates and broadcasts to relevant recipients
4. Recipients receive the message in real-time
5. Message is stored in the database for persistence

### User Presence Tracking
The application tracks user activity through:
- Socket connection events (connect/disconnect)
- Heartbeat mechanism to detect inactive users
- Real-time updates of the online user list
- Room-specific presence information

### Authentication Flow
1. User registers or logs in through the auth form
2. Backend validates credentials and issues JWT token
3. Token is stored in localStorage
4. Token is sent with all API requests and Socket connections
5. Session is maintained until user logs out

## 🎨 UI Components

### Main Components
- **ChatWindow**: Main conversation display area
- **MessageInput**: Text input with send functionality
- **UserList**: Sidebar showing online users
- **RoomList**: Navigation for different chat rooms
- **AuthForm**: Login and registration interface
- **MessageBubble**: Individual message display
- **TypingIndicator**: Shows when users are typing
- **NotificationBadge**: Unread message counter

## 🔧 Configuration

### Socket.IO Events

**Client Emits:**
- `join_room` - Join a specific chat room
- `send_message` - Send a new message
- `typing` - Notify others of typing status
- `leave_room` - Leave a chat room

**Client Listens:**
- `receive_message` - Receive new messages
- `user_joined` - User joined notification
- `user_left` - User left notification
- `typing_status` - Someone is typing
- `online_users` - Updated list of online users

### API Endpoints

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - User login
GET    /api/auth/verify      - Verify JWT token
GET    /api/messages/:roomId - Fetch message history
POST   /api/rooms/create     - Create new chat room
GET    /api/rooms            - Get all available rooms
```

## 🌐 Backend Integration

This frontend connects to the TalkM backend server. To set up the complete application:

1. Clone the backend repository: [chatweb_backend](https://github.com/Bisha18/chatweb_backend)
2. Follow the backend setup instructions
3. Ensure both frontend and backend are running
4. Configure the `.env` file with correct backend URLs

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
```

2. **Deploy**
```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables for Production
Set these in your Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

Visit the live application: [talksyweb.vercel.app](https://talksyweb.vercel.app)

## 📱 Browser Support

TalkM is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Environment variables for sensitive data
- CORS properly configured
- XSS protection implemented
- Socket connections authenticated

## 🐛 Known Issues & Roadmap

### Current Limitations
- File/image sharing not yet implemented
- Voice/video calls not available
- Message edit/delete functionality pending

### Upcoming Features
- [ ] File and image sharing
- [ ] Message reactions (emoji)
- [ ] User profiles with avatars
- [ ] Voice and video calls
- [ ] Message search functionality
- [ ] Dark mode theme
- [ ] Message encryption (E2E)
- [ ] Desktop notifications
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Bishal Paul**

- GitHub: [@Bisha18](https://github.com/Bisha18)
- LinkedIn: [Bishal Paul](https://www.linkedin.com/in/bishal-paul-2897a624b/)
- Email: d.bishalpaul@gmail.com
- Portfolio: [Coming Soon]

## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the amazing UI library
- [Vite](https://vitejs.dev/) for the blazing-fast build tool
- [Vercel](https://vercel.com/) for hosting and deployment
- All contributors and testers

## 📊 Project Status

This project is actively maintained and open for contributions. Feel free to report issues or suggest new features!

## 🔗 Related Repositories

- **Backend**: [chatweb_backend](https://github.com/Bisha18/chatapp_backend)


Made with ❤️ by Bishal Paul

</div>
