# Zyvox AI Backend Server

Backend server for Zyvox AI investment platform with MongoDB integration.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file with:
```
MONGODB_URI=mongodb+srv://prannavp803_db_user:xHGQeSU2imElJF9F@cluster0.9p5yemj.mongodb.net/?appName=Cluster0
PORT=5000
NODE_ENV=development
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_SECRET=your_jwt_secret_key
```

### 3. Start Server
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Users
- `POST /api/users` - Create or update user
- `GET /api/users` - Get all users
- `GET /api/users/clerk/:clerkId` - Get user by Clerk ID
- `PUT /api/users/:clerkId` - Update user
- `DELETE /api/users/:clerkId` - Delete user

### Portfolio
- `POST /api/portfolio/:clerkId` - Save portfolio
- `GET /api/portfolio/:clerkId` - Get portfolio
- `POST /api/portfolio/:clerkId/investment` - Add investment
- `GET /api/portfolio/:clerkId/investments` - Get investments

### Health
- `GET /api/health` - Server health check

## Database Collections

### users
```javascript
{
  _id: ObjectId,
  clerkId: String,
  email: String,
  firstName: String,
  lastName: String,
  profileImage: String,
  portfolio: Object,
  investments: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Features

✅ MongoDB integration  
✅ Express REST API  
✅ CORS enabled  
✅ User management  
✅ Portfolio tracking  
✅ Investment management  
✅ Error handling  
✅ Graceful shutdown  

## Development

The server uses nodemon for development. Any changes to files will automatically restart the server.

```bash
npm run dev
```

## Production

For production deployment:

```bash
npm start
```

Make sure to set `NODE_ENV=production` in your `.env` file.
