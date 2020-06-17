exports.getDetails = (req,res,render) => {
    res.render('everyone/details', {
        movieId: req.params.id
    });
}