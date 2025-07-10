// routes/movieRoutes.js

const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const movieController = require('../controllers/movieController');

// Only accept .xlsx files
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname) === '.xlsx') {
        cb(null, true);
    } else {
        cb(new Error('Only .xlsx files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Admin only
router.post('/', verifyToken, isAdmin, movieController.createMovie);
router.post('/bulk-upload', verifyToken, isAdmin, upload.single('file'), movieController.bulkUpload);

// Admin & User
router.get('/get-movies', verifyToken, movieController.getMovies);

module.exports = router;
