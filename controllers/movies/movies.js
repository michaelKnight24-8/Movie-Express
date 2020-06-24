exports.getDetails = (req,res,next) => {
    res.render('everyone/details', {
        movieId: req.params.id,
        user: req.session.user
    });
}

exports.getReview = (req,res,next) => {
    console.log(req.params.poster.src);
    res.render('forms/review', {
        name: req.params.name,
        date: req.params.date,
        user: req.session.user,
        poster: decodeURIComponent(req.params.poster)
    });
}

