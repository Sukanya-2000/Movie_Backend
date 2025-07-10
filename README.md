# 🎬 Movie Backend API (Node.js + Express + MongoDB)

A mini backend system with role-based authentication and movie management.

## ✅ Features

- Admin & User roles (JWT-based auth)
- Movie creation (manual and Excel bulk upload)
- Pagination & filtering (by genre and rating)
- Multer + XLSX-based file upload
- Protected routes using middleware

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file upload)
- XLSX (Excel parsing)

---

## 📦 Installation & Setup


# Step 1: Clone the repo
```
git clone https://github.com/your-username/movie-backend.git
cd movie-backend
```

# Step 2: Install dependencies
```
npm install
```

# Step 3: Create .env file
```
touch .env
echo "PORT=5000" >> .env
echo "MONGO_URI=mongodb://127.0.0.1:27017/movieDB" >> .env
echo "JWT_SECRET=your_jwt_secret" >> .env
```

# Step 4: Create uploads folder for Excel files
```
mkdir uploads
```

# Step 5: Start MongoDB (in a separate terminal)
```
mongod
```

# Step 6: Start the server
```
npm start
```


## Testing

# Register Admin
curl -X POST http://localhost:5000/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Login Admin
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

```
{ "token": "your_jwt_token_here" }
```

# Create Movie (Admin only)
curl -X POST http://localhost:5000/movies \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Inception", "rating": 9, "genres": ["Sci-Fi", "Thriller"]}'

# Bulk Upload (Admin only) using .xlsx file
curl -X POST http://localhost:5000/movies/bulk-upload \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@/absolute/path/to/movies.xlsx"

# List Movies (Admin & User)
curl -X GET "http://localhost:5000/movies/get-movies?page=1&limit=10&genre=Sci-Fi" \
  -H "Authorization: Bearer <your_token>"





