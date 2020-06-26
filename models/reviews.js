const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    movieName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    spoilers: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);

