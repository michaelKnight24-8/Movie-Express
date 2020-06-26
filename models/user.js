const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  //dark theme by default
  colorScheme: {
      type: String,
      required: true
  },  
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
      type: String,
      required: true
  },
  lastName: {
      type: String,
      required: true
  },
  avatar: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  favorites: {
    items: [
      {
        showId: {
            type: Schema.Types.ObjectId,
            ref: 'Show',
            required: true
          }
      }
    ]
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

userSchema.methods.addToFavorites = function(show) {
    const showIndex = this.favorites.items.findIndex(cp => {
      return cp.showId.toString() === show._id.toString();
    });
    const updatedFavoritesItems = [...this.favorites.items];
  
    updatedFavoritesItems.push({ showId: show._id });

    const updatedFavs = { items: updatedFavoritesItems };
    this.favorites = updatedFavs;
    return this.save();
};

userSchema.methods.addToReviews = function(review) {
    
    const reviewIndex = this.reviews.items.findIndex(cp => {
      return cp.reviewId.toString() === review._id.toString();
    });
    const updatedReviewsItems = [...this.reviews.items];
  
    updatedReviewsItems.push({ reviewId: review._id });

    const updatedReviews = { items: updatedReviewsItems };
    this.reviews = updatedReviews;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);

