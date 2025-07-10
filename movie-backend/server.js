// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);

// Connect DB & Start Server
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
