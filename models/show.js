const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const showSchema = new Schema({
  movieName: {
      type: String,
      required: true,
  },
  reviews: {
      items: [
          {
            reviewId: {
                type: Schema.Types.ObjectId,
                ref: 'Review',
                required: true
              }
          }
      ]
  }
});

module.exports = mongoose.model('Show', showSchema);