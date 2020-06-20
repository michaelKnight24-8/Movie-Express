var currentActiveAvatar = "";
var currentColorTheme = "";
//holds the container ids
var containerIds = ["reviews-container", "favorite-movies-container",
"info-container", "prefs-container"];

//holds slideout ids
var slideOutIds = ["preferences", "personal-info", "reviews", "your-favorites"];


function bodyClick(){
    if($("#sidebar").hasClass('change')){
        toggleSidebar();
    }
    closeAllMenus()
}

function closeAllMenus() {
   //container ids
   var containerIds = ["reviews-container", "favorite-movies-container",
   "info-container", "prefs-container"]

  //iterate over them and disable the highlight if it is there
  for (container of containerIds) {
    if ($("#" + container).hasClass('current')) {
      document.getElementById(container).classList.toggle('current');
    }
  }

  //now do the same for the pullout menus
  var slideOutIds = ["preferences", "personal-info", "reviews", "your-favorites"];

  for (slide of slideOutIds) {
    if ($("#" + slide).hasClass('change')) {
      document.getElementById(slide).classList.toggle('change');
    }
  }
}

function toggleSidebar() {
  document.getElementById("container").style["visibility"] = "hidden";
  document.getElementById('sidebar').classList.toggle('change');
  document.getElementById('main-crap').classList.toggle('blur');
  if (document.getElementById('bar1').style.backgroundColor == 'white') {
    closeAllMenus();
    document.getElementById('bar1').style.backgroundColor = 'black';
    document.getElementById('bar3').style.backgroundColor = 'black';
  } else {
    document.getElementById('bar1').style.backgroundColor = 'white';
    document.getElementById('bar3').style.backgroundColor = 'white';
  }
}

$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
      let searchText = $('#searchText').val();
      getMovies(searchText);
      e.preventDefault();
    });
  });
  
function getMovies(searchText){
  if (searchText.length == 0) {
    document.getElementById("container").style["visibility"] = "hidden";
  } else {
    document.getElementById("container").style["visibility"] = "visible";
    axios.get('https://www.omdbapi.com/?i=tt3896198&apikey=b85b1f97&s='+searchText)
      .then((response) => {
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
          axios.get('https://www.omdbapi.com/?i='+movie.imdbID+'&apikey=b85b1f97&')
          .then((response) => {
            let movieData = response.data;
            var actors = movieData.Actors;
            var actorsArray = actors.split(',');
            if (actorsArray.length > 1) {
                actors = actorsArray[0] + ", " + actorsArray[1];  
            } else {
              actors = actorsArray;
            }

            output += `
              <div class="search-data">
                <div class="show-container" onclick="movieSelected('${movieData.imdbID}')">
                  <img src="${movieData.Poster}" class="show-image">
                    <div class="actual-data>
                      <h5 class="show-title">${movieData.Title}</h5>
                      <div class="release-year">${movieData.Year}</div>
                      <div>${actors}</div>
                    </div>
                </div>
              </div>
            `;
            $('#movies').html(output);
            
          });
        });
        
      })
      .catch((err) => {
        console.log(err);
      });
    }
}
  
function movieSelected(id){
  window.location.href = '../movie/details/' + id;
  return false;
}

function loadTopInfo() {
  var shows = document.getElementsByClassName("top-tv-shows");
  var movies = document.getElementsByClassName("top-movies-all");
  
  var index = 0;
  for (show of shows) {
    axios.get('https://www.omdbapi.com/?i=tt3896198&apikey=b85b1f97&s='+show.value)
    .then((response) => {
      let output = '';
      let movieInd = response.data.Search[0];
        output += `
          <div class="top-show-container">
            <div class="top-show-holder">
            <img src="${movieInd.Poster}" class="images" onclick="goToDetails(${index})">
              <input type="text" hidden id="${index}"value="${movieInd.imdbID}">
            </div>
          </div>
        `;
        index++;
        document.getElementById("top-shows").innerHTML += output;
  });
}
  index = 0;
  for (movie of movies) {
    axios.get('https://www.omdbapi.com/?i=tt3896198&apikey=b85b1f97&s='+movie.value)
    .then((response) => {
      let output = '';
      let movieInd = response.data.Search[0];
        output += `
          <div class="top-movie-container">
            <div class="top-movie-holder">
            <img src="${movieInd.Poster}" class="images" onclick="goToDetails(${index})">
              <input type="text" hidden id="${index}"value="${movieInd.imdbID}">
            </div>
          </div>
        `;
        index++;
        document.getElementById("top-movies").innerHTML += output;
  });

  }
}

function goToDetails(movieId) {
  movieSelected(document.getElementById(movieId).value);
}

function moveLeft(context) {
  document.getElementById(context).scrollLeft += 50;
};

function moveRight(context) {
  document.getElementById(context).scrollLeft -= 50;
};

function toggleThemes(color) {

  switch (currentColorTheme) {
      case "blue":
        blueTheme();
        break;
      case "white":
        whiteTheme();
    }

  //the hard part! Find what the current color is, and toggle the color so it
  //turns off. Then, toggle the correct color on all the different elements,
  //to match the correct color
  if  (color.split("-")[0] == "blue") 
    blueTheme();

  if (color.split("-")[0] == "white") 
    whiteTheme();
  if (color.split("-")[0] == "dark")
    currentColorTheme = "dark";
  
}

function whiteTheme() {
  for (slide of slideOutIds) 
      document.getElementById(slide).classList.toggle("light-theme");
  

    document.getElementById("sidebar").classList.toggle("light-theme");
    document.getElementById("theBody").classList.toggle("light-theme");
    document.getElementById("top-movies-header").classList.toggle("scrape-theme");
    document.getElementById("top-shows-header").classList.toggle("scrape-theme");

    document.getElementById("top-shows").classList.toggle("container-theme");
    document.getElementById("top-movies").classList.toggle("container-theme");

    currentColorTheme = "white";
}

function blueTheme() {
  for (slide of slideOutIds) 
  document.getElementById(slide).classList.toggle("steel-blue-theme");

  document.getElementById('search-header').classList.toggle("blue-headers");
  document.getElementById("sidebar").classList.toggle("steel-blue-theme");
  document.getElementById("theBody").classList.toggle("blue-theme");
  currentColorTheme = "blue"
}

//function to iterate over all the available containers and slideout menus to open, and shut
//ones as needed
function showHidden(context, context2) {

    //iterate over conatiners and ids and shut them if needed so there is no overlap
    for (container of containerIds) {
        if (context != container) {
            if ($("#" + container).hasClass('current')) {
                document.getElementById(container).classList.toggle('current');
            }
        }
    }

    //now for slideOut stuff
    for (slide of slideOutIds) {
        if (context != slide) {
            if ($("#" + slide).hasClass('change')) {
                document.getElementById(slide).classList.toggle('change');
            }
        }
    }

    document.getElementById(context).classList.toggle("change");
    document.getElementById(context2).classList.toggle('current');
}

function setActive(context) {
  var colorArray = ["dark-col", "white-col", "blue-col"];
  for (color of colorArray) {
      if (context != color) {
          if ($("#" + color).hasClass('active')) {
              document.getElementById(color).classList.toggle('active');
          }
      }
  }
  document.getElementById(context).classList.toggle('active');
  
  toggleThemes(context.split("-")[0])
}

function changeAvatar(avatarId) {
  if (currentActiveAvatar != "") 
    document.getElementById(currentActiveAvatar).classList.toggle('current-avatar');

  document.getElementById(avatarId).classList.toggle('current-avatar');
  currentActiveAvatar = avatarId;

  document.getElementById("img").style["background-image"] = 'url(../images/' + avatarId + '.png)';
}