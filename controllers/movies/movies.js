const Reviews = require("../../models/reviews");

exports.getDetails = (req,res,next) => {
    
    Reviews.find({ movieId: req.params.id })
    .then(reviews => {
        res.render('everyone/details', {
            movieId: req.params.id,
            user: req.session.user,
            reviews: reviews
        });
    });
}

exports.getReview = (req,res,next) => {
    console.log(req.params.poster.src);
    res.render('forms/review', {
        name: req.params.name,
        date: req.params.date,
        user: req.session.user,
        poster: decodeURIComponent(req.params.poster),
        movieId: req.params.id
    });
}

