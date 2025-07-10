const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    genres: [String],
    watchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('Movie', movieSchema);
