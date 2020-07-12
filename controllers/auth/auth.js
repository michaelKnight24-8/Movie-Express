const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require("../../models/user");
const Reviews = require("../../models/reviews");
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));


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

exports.login = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now() } })
   .then(user => {
    res.render('forms/reset', {
      userId: user._id.toString(),
      passwordToken: token
    });
   })
};

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
              recent: { items: [] },
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

exports.reset = (req,res,next) => {
  console.log("got here!!!!");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.emailF })
     .then(user => {
       if (!user) {
         return res.redirect('../../');
       }
       user.resetToken = token;
       user.resetTokenExpiration = Date.now() + 3600000;
       return user.save();
     })
     .then(result => {
       transporter.sendMail({
         to: req.body.emailF,
         from: 'mknighter62@gmail.com',
         subject: 'Password reset',
         html: `
         <p>You have requested a password reset</p>
         <p><a href="http://localhost:5000/auth/reset/${token}">Click here</a></p>
         `
       });
     })
     .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  });
  res.redirect('../../');
}

exports.addFavorites = (req,res,next) => {
  console.log("gothere!");
  var img = decodeURIComponent(req.params.img);
  var add = req.params.add == 'yes';
  User.findOne({ email: req.session.user.email })
  .then(user => {
    if (add) user.addToFavorites(img);
    else user.removeFromFavorites(img);
    req.session.isLoggedIn = true;
    req.session.user = user;
    return req.session.save(err => {
      console.log(err);
      res.redirect('../../../');
    })
  })
}

exports.newPassword = (req,res,next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  var resetUser;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      req.flash("error", "Password reset!");
      res.redirect('../../');
    })
}