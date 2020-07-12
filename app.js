const path = require('path');
var PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require("request");


const app = express();
const corsVar = require('cors');
const User = require('./models/user');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes/auth');
const movieRoutes = require('./routes/movie/movie');
const MongoDBList = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const MONGODB_URI =
    'mongodb+srv://mknight24:Lak3rs24@cluster0-20afh.mongodb.net/imdb?retryWrites=true&w=majority';

const shows = new MongoDBList({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const corsOptions = {
    origin: "https://assignment-2-cs341.herokuapp.com/",
    optionsSuccessStatus: 200
};

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};
app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyParser.urlencoded({extended: false}))
    .use(flash())
    .use(
        session({
            secret: 'my secret',
            resave: false,
            saveUninitialized: false,
            shows: shows
        })) 
    .use((req, res, next) => {
        if (!req.session.user) {
            return next();
        }
        User.findById(req.session.user._id)
         .then(user => {
             req.user = user;
             next();
         })
         .catch(error => {
             next(new Error(error));
         });
    })    
    .use('/auth', authRoutes)
    .use('/movie', movieRoutes)
    .get("/", (req, res, next) => {
        var review = null;
        var favorite = null;
        var recents = null;
        if (req.session.isLoggedIn) {
            req.user
            .populate('recent.items')
            .execPopulate()
            .then(user => {
                recents = user.recent.items;
            });
            req.user
            .populate('reviews.items.reviewId')
            .execPopulate()
            .then(user => {
            review = user.reviews.items;
            });

            req.user
            .populate('favorites.items')
            .execPopulate()
            .then(user => {
            favorite = user.favorites.items;
            });
        }
        var movies = [];
        url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250";
        request(url, function (error, response, html) {
            var $ = cheerio.load(html);
            var index = 0;
            $(".titleColumn").each(function(i, item) {
                if (i < 10) {
                    movies.push($("td a", item).text());
                } else { return false; }
            });
        })
        
        var tvShows = [];
        url = "https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250";
        request(url, function (error, response, html) {
            var $ = cheerio.load(html);
            var index = 0;
            $(".titleColumn").each(function(i, item) {
                if (i < 10) {
                    tvShows.push($("td a", item).text());
                } else {
                    
                    // This is the primary index, always handled last. 
                    res.render('everyone/home', {
                        TvShows: tvShows,
                        Movies: movies,
                        user: req.session.user,
                        isLoggednIn: req.session.isLoggedIn,
                        review: review,
                        favorite: favorite,
                        recent: recents
                    }); 
                    return false;
                }
            });
        })
    })
    .use((req, res, next) => {
        res.status(404).render('everyone/404', { pageTitle: 'Page Not Found' });
    });

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://mknight24:Lak3rs24@cluster0-20afh.mongodb.net/imdb?retryWrites=true&w=majority'
mongoose
  .connect(
      MONGODB_URL 
    )
   .then(result => {
    User.findOne().then(user => {
      if (!user) {
          const user = new User({
              lastName: "Knight",
              firstName: "Michael",
              colorScheme: "dark",
              email: "kni15005@byui.edu",
              password: "sup",
              favorites: {
                  items: []
              },
              reviews: {
                  items: []
              },
          });
        user.save();
      }
  });
  app.listen(PORT);
  console.log('Connected!');
})
.catch(error => {
   console.log(error);
});