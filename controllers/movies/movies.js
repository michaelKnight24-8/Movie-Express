const Reviews = require("../../models/reviews");
const User = require("../../models/user");

exports.getDetails = (req,res,next) => {
    var favorites = null;
    
    if (req.session.isLoggedIn) {
        req.user.addRecentlyViewed(decodeURIComponent(req.params.showURL));
        req.user
        .populate('favorites.items')
        .execPopulate()
        .then(user => {
        favorites = user.favorites.items;
        });
    }
    Reviews.find({ movieId: req.params.id })
    .then(reviews => {
        res.render('everyone/details', {
            movieId: req.params.id,
            user: req.session.user,
            reviews: reviews,
            favorites: favorites
        });
    });
}

exports.getReview = (req,res,next) => {
    
    res.render('forms/review', {
        name: req.params.name,
        date: req.params.date,
        user: req.session.user,
        poster: decodeURIComponent(req.params.poster),
        movieId: req.params.id
    });
}

