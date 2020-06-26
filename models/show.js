const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showSchema = new Schema({
  movieName: {
      type: String,
      required: true,
  },
  moviePoster: {
    type: URL,
    required: true,
  }
});

module.exports = mongoose.model('Show', showSchema);