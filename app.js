const path = require('path');
var PORT = process.env.PORT || 5000;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const request = require("request");


const app = express();
const corsVar = require('cors');
// const User = require('./models/user');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes/auth');
const movieRoutes = require('./routes/movie/movie');
const MongoDBList = require('connect-mongodb-session')(session);

// const stats = new MongoDBList({
//     uri: MONGODB_URI,
//     collection: 'sessions'
// });

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
    .use('/auth', authRoutes)
    .use('/movie', movieRoutes)
    .get("/", (req, res, next) => {
        var movies = [];
        url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250";
        request(url, function (error, response, html) {
            var $ = cheerio.load(html);
            var index = 0;
            $(".titleColumn").each(function(i, item) {
                if (i < 10) {
                    movies.push($("td a", item).text());
                }
            });
        })
        console.log(movies);
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
                        Movies: movies
                    }); 
                    return false;
                }
            });
        })
       });
mongoose
    .connect( 
    'mongodb+srv://mknight24:Lak3rs24@cluster0-20afh.mongodb.net/imdb?retryWrites=true&w=majority'
    )
    .then(result => {
        app.listen(PORT);
        console.log("connected!");
    })
    .catch(err => {
        console.log(err);
    }); 
