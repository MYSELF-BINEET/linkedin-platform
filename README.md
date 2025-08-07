# Social Network App
A full-stack social networking platform where users can register, create posts, interact with others via likes and comments, and manage their own profiles with profile pictures and cover photos.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (Vite or CRA)
- React Router
- Tailwind CSS
- Axios
- React Hot Toast (notifications)
- Lucide React Icons

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (file uploads)
- JSON Web Token (JWT) Authentication
- bcrypt.js (password hashing)

---

## 🚀 Features

### **Required Features**
#### 1. User Authentication
- **Register/Login** with Email & Password
- Profile containing:
  - Name
  - Email
  - Bio

#### 2. Public Post Feed
- Create, read, and display **text-only posts**
- Home feed with:
  - Author's name
  - Timestamp

#### 3. Profile Page
- View a user's profile
- See all posts created by the user

---

### **Extra Features Implemented**
- **Profile Pictures**  
  Users can upload, update, and delete their profile picture.
- **Cover Photos**  
  Users can upload and update their cover photo.
- **Likes & Comments**  
  - Like/unlike posts  
  - Add and view comments under posts
- **Post Deletion**  
  Users can delete their own posts.
- **Responsive Design**  
  Mobile-friendly layout with Tailwind CSS.
- **Real-time UI updates**  
  Posts, likes, and comments update instantly after actions.

---

## 📂 Project Structure

```
project/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### **1. Clone the repository**
```bash
git clone https://github.com/MYSELF-BINEET/linkedin-platform.git
```

### **2. Install dependencies**

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### **3. Environment variables**
Create a `.env` file inside the `server` folder:
```env
NODE_ENV=development
PORT=5050
MONGODB_URI=mongodb+srv://bineetpradhan03:sw03Xe8546BeTPTl@cluster0.oylvmq1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=my-secret
JWT_EXPIRES_IN=7d
URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=dj76qfsys
CLOUDINARY_API_KEY=911371812386156
CLOUDINARY_API_SECRET=t1GBAfax_vXNgCMNp3PB0kxHFYM
```
Create a `.env` file inside the `client` folder:
```env
VITE_API_URL=http://localhost:5173
```

### **4. Start the development servers**

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

---

## 🔑 Demo / Admin Credentials (if applicable)

**Demo User:**
- Email: `bineetpradhan03@gmail.com`
- Password: `Bineet@2003`

---

## 📌 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a post |
| POST | `/api/posts/:id/like` | Like/unlike a post |
| POST | `/api/posts/:id/comments` | Add a comment |
| GET | `/api/users/:id` | Get user profile |
| POST | `/api/users/profile-picture` | Upload profile picture |
| POST | `/api/users/cover-photo` | Upload cover photo |

---

## 📷 Screenshots

*(Add screenshots of your UI here)*

- **Login/Register Page**
- **Home Feed**
- **Profile Page**
- **Post Creation**
- **Comments Section**

---

## 🚀 Deployment

### **Frontend (Vercel/Netlify)**
```bash
# Build the frontend
cd client
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### **Backend (Heroku/Railway)**
```bash
# Deploy to Heroku
heroku create your-app-name
git push heroku main

# Or deploy to Railway
railway deploy
```

---

## 💡 Future Improvements

- Add image/video support for posts
- Implement real-time chat between users
- Infinite scroll for posts
- Notifications system
- Friend/Follow system
- Dark mode toggle
- Search functionality
- Post sharing capabilities
- Email verification
- Password reset functionality

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/MYSELF-BINEET/linkedin-platform](https://github.com/MYSELF-BINEET/linkedin-platform)

---

## ⭐ Show your support

Give a ⭐️ if this project helped you!
