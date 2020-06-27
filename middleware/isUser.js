module.exports = (req, res, next) => {
    console.log("got here booiiii");
    if (!req.session.isLoggedIn) 
        return res.redirect('../../../../../auth/login');

    next();
}