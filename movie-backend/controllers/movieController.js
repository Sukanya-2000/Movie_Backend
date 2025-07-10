const Movie = require('../models/Movie');
const xlsx = require('xlsx');
const path = require('path');

exports.createMovie = async (req, res) => {
    try {
        const { name, rating, genres, watchedUsers } = req.body;

        // Basic validations
        if (!name || !rating || !genres) {
            return res.status(400).json({ msg: 'name, rating and genres are required' });
        }

        if (typeof name !== 'string' || typeof rating !== 'number' || !Array.isArray(genres)) {
            return res.status(400).json({ msg: 'Invalid data types' });
        }

        if (rating < 0 || rating > 10) {
            return res.status(400).json({ msg: 'Rating must be between 0 and 10' });
        }

        const movie = new Movie({
            name,
            rating,
            genres,
            watchedUsers: watchedUsers || []
        });

        await movie.save();
        res.json({ msg: 'Movie created', movie });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.bulkUpload = async (req, res) => {
    try {
        // Check file type
        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx') {
            return res.status(400).json({ msg: 'Only .xlsx files are allowed' });
        }

        const filePath = file.path;
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(sheet);

        if (!rows.length) {
            return res.status(400).json({ msg: 'Excel sheet is empty' });
        }

        const requiredCols = ['name', 'rating', 'genres'];
        const missingCols = requiredCols.filter(col => !Object.keys(rows[0]).includes(col));
        if (missingCols.length > 0) {
            return res.status(400).json({ msg: `Missing columns: ${missingCols.join(', ')}` });
        }

        const movieDocs = [];

        for (const row of rows) {
            if (!row.name || typeof row.name !== 'string') {
                return res.status(400).json({ msg: `Invalid or missing 'name' in row: ${JSON.stringify(row)}` });
            }

            const rating = Number(row.rating);
            if (isNaN(rating) || rating < 0 || rating > 10) {
                return res.status(400).json({ msg: `Invalid rating in row: ${JSON.stringify(row)}` });
            }

            const genres = typeof row.genres === 'string'
                ? row.genres.split(',').map(g => g.trim())
                : [];

            if (!genres.length) {
                return res.status(400).json({ msg: `Genres missing or invalid in row: ${JSON.stringify(row)}` });
            }

            movieDocs.push({
                name: row.name,
                rating: rating,
                genres: genres,
                watchedUsers: []
            });
        }

        await Movie.insertMany(movieDocs);
        res.json({ msg: 'Bulk upload successful', count: movieDocs.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during bulk upload' });
    }
};

exports.getMovies = async (req, res) => {
    try {
        const { page = 1, limit = 10, genre, rating } = req.query;
        const filter = {};
        if (genre) filter.genres = genre;
        if (rating) filter.rating = Number(rating);

        const movies = await Movie.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ page: Number(page), limit: Number(limit), movies });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error fetching movies' });
    }
};
