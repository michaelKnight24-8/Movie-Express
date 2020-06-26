const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require("../../models/user");
const Reviews = require("../../models/reviews");
const { validationResult } = require('express-validator/check');

exports.getLogin = (req,res,next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("forms/login",{
        error: message
  });
}

exports.addReview = (req,res,next) => {
  var isSpoiler = req.params.spoiler == 'yes';
  var name = req.body.movieName;
  var headline = req.body.headline;
  var theReview = req.body.review;
  var numStars = req.body.stars;
  var user = req.session.user;
  var newShow = null;
  var d = new Date();
  var date = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
  var review = new Reviews({
    movieId: req.body.movieId,
    movieName: name,
    userId: user._id,
    headline: headline,
    rating: numStars,
    review: theReview,
    date: date,
    spoilers: isSpoiler
   });
  review.save();
  User.findOne({ email: user.email })
    .then(userFound => {
      userFound.addToReviews(review); 
      req.session.user = userFound;
      req.session.isLoggedIn = true;
      return req.session.save(err => {
        console.log(err);
        res.redirect('../../');
    });
  });
}

exports.postSignUp = (req,res,next) => {    
    const email = req.body.emailS;
    const first = req.body.fname;
    const last = req.body.lname;
    const password = req.body.passS;
    User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-Mail exists already');
        return res.redirect('../auth/login');
      }
      return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword,
              colorScheme: "dark",
              avatar: "none",
              favorites: { items: [] },
              reviews: { items: [] },
              lastName: last,
              firstName: first
            });
            user.save();
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save();
          })
          .then(result => {
            res.redirect('../')
            .catch(error => { 
                console.log(error);
              });
            })
            .catch(err => {
              const error = new Error(err);
        });
    });
}

exports.postLogin = (req,res,next) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid credentials');
        return res.redirect('../auth/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('../');
              })
          }
          req.flash('error', 'Invalid credentials');
          return res.redirect('../');
        })
        .catch(err => {
          console.log(err);
          res.redirect('../auth/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
    });
}

exports.changeTheme = (req,res,next) => {
    var theme = req.params.color;
    var avatar = req.params.avatar;
    User.findOne({email: req.session.user.email})   
    .then(user => {
        user.avatar = avatar;
        user.colorScheme = theme;
        user.save();
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save();
        })
        .then(result => {
            res.redirect('../../../')
            .catch(error => { 
                console.log(error);
              });
            })
            .catch(err => {
              const error = new Error(err);
    });
}

exports.logout = (req,res,next) => {
  req.session.destroy(err => {
      console.log(err);
      res.redirect('../');
  });
}

