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
        showURL: {
            type: String,
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
  },
  recent: {
      items: [
         {
            showURL: {
              type: String,
              required: true
            }
         }
      ]
  }
});

userSchema.methods.removeFromFavorites = function(showURL) {
  const favoritesItems = [...this.favorites.items];
  favoritesItems.pop({ showURL: showURL});
  
  this.favorites = { items: favoritesItems };
  return this.save();
}

userSchema.methods.addRecentlyViewed = function(showURL) {
  var hasIt = false;
    var recents = [...this.recent.items];
    if (recents.length == 6) 
      recents.shift();
    for (val of recents) 
      if (val.showURL == showURL) hasIt = true;
    
    
    if (showURL != 'details.js' && !hasIt)
     recents.push({ showURL: showURL});
    this.recent = { items: recents };
    
    return this.save();
}

userSchema.methods.addToFavorites = function(showURL) {
    const updatedFavoritesItems = [...this.favorites.items];
  
    updatedFavoritesItems.push({ showURL: showURL });

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

