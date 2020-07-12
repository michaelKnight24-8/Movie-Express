//so I know which one is currently active, so it makes ading and removing
var currentActiveAvatar = "none";
var currentColorTheme = "";
//holds the container ids
var containerIds = ["reviews-container", "favorite-movies-container",
"info-container", "prefs-container"];


//holds slideout ids
var slideOutIds = ["preferences", "personal-info", "reviews", "your-favorites"];



//shuts the slide out menu when the clicked outside of the menu
function bodyClick(){
    if($("#sidebar").hasClass('change')){
        toggleSidebar();
    }
    closeAllMenus()
}


//closes all the open menus, and submenus when clicked outside of the slideout menu
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

//toggles open/close on the slide out menu on the side
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

//gets the value in the search box, and kicks off the API call
$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
      let searchText = $('#searchText').val();
      getMovies(searchText);
      e.preventDefault();
    });
  });
  

//Handle the search implementation. When the user searches for something, it updates it
//every time the user inputs a letter. The API is actaully called twice here. Once to get the 
//imdb iD (using their own algorithm) which is then used to call the API again, so I can display to the user
//the name of the movie, the poster, and waht year it was made in. I also have it show only two
//actors that are in the movie. When they click in the mimage they can see more. I parse it at the 
//comma seperating the two names. If there is only one actor listed, then it only shows that one person
function getMovies(searchText) {
  if (searchText.length == 0) {
    document.getElementById("container").style["visibility"] = "hidden";
  } else {
    document.getElementById("container").style["visibility"] = "visible";
    axios.get('https://www.omdbapi.com/?i=tt3896198&apikey=b85b1f97&s=' + searchText)
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
                <div class="show-container" id="${movieData.Poster}" onclick="movieSelected('${movieData.imdbID}', this.id)">
                  <img src="${movieData.Poster}" class="show-image">
                    <div class="actual-data>
                      <h5 class="show-title">${movieData.Title}</h5>
                      <div class="release-year">${movieData.Year}</div>
                      <div>${actors}</div>
                    </div>
                </div>
              </div>`;
            $('#movies').html(output);
          });
        });
        
      })
      .catch((err) => {
        console.log(err);
      });
    }
}


//calls the corresponding route to load the page showing more details about a certain show
function movieSelected(id, movieURL) {
  window.location.href = '../movie/details/' + id + "/" + encodeURIComponent(movieURL);
}

//Two api calls are made here. In the beginnig of the route I do the web scrape and 
//get the top 10 rated movies and shows right now in the world, and stores them in hidden input fields.
//this then takes those values, uses the API on each one, and displays everything all nicely!
function loadTopInfo(theme) {
  if (document.getElementById("hasUser").value == 'yes')
    currentActiveAvatar = document.getElementById('avatar-holder').value;

  var shows = document.getElementsByClassName("top-tv-shows");
  var movies = document.getElementsByClassName("top-movies-all");
  
  var index = 0;

  var showURL = "";
  for (show of shows) {
    axios.get('https://www.omdbapi.com/?i=tt3896198&apikey=b85b1f97&s='+show.value)
    .then((response) => {
      let output = '';
      var hi = "hh";
      let movieInd = response.data.Search[0];
      showURL = movieInd.Poster;
        output += `
          <div class="top-show-container">
            <div class="top-show-holder">
            <img src="${movieInd.Poster}" class="images" onclick="goToDetails(${index},this.src)">
              <input type="text" hidden id="${index}"value="${movieInd.imdbID}">
            </div>
          </div>
        `;
        index++;
        document.getElementById("top-shows").innerHTML += output;
  });
  if (theme != 'none') {
    switch(theme) {
      case 'blue':
        blueTheme();
        break;
      case 'white':
        whiteTheme();  
        break;
      case 'dark':
        darkTheme();  
    }
  }
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
            <img src="${movieInd.Poster}" class="images" onclick="goToDetails(${index}, this.src)">
              <input type="text" hidden id="${index}" value="${movieInd.imdbID}">
            </div>
          </div>
        `;
        index++;
        document.getElementById("top-movies").innerHTML += output;
  });

  }
}

//small route handling
function goToDetails(index, showURL) {
  console.log("In goTo: " + showURL);
  movieSelected(document.getElementById(index).value, showURL);
}

//handles moving a div scroll left
function moveLeft(context) {
  document.getElementById(context).scrollLeft += 50;
};

//handles moving it right. I know that I could do this with just one function, 
//and pass in two values, one with the context (which element I am scrolling through)
//and which direction (be it -50 for th right, or 50 for the left)
function moveRight(context) {
  document.getElementById(context).scrollLeft -= 50;
};


//a big function with the logic for chanhing the theme. It evaluates which theme is currently active,
//removes the active class form it, and sets it to the theme clicked on, then calls functions which contain
//which elements are being changed, and all that jazz
function toggleThemes(color) {

  switch (color) {
      case "blue":
        blueTheme();
        break;
      case "white":
        whiteTheme();
        break;
      case "dark":
        darkTheme();
        break;
    }
  
}



function whiteTheme() {
  for (slide of slideOutIds) {
      document.getElementById(slide).style.backgroundColor = "white";
      document.getElementById(slide).style.color = "turquoise";
  }
  

    document.getElementById("sidebar").style.backgroundColor = "white";
    document.getElementById("sidebar").style.color = "turquoise";

    document.getElementById("theBody").style.backgroundColor = "white";
    document.getElementById("theBody").style.color = "turquoise";

    document.getElementById("top-movies-header").style.color = "turquoise";
    document.getElementById("top-shows-header").style.color = "turquoise";

    document.getElementById("top-shows").style.border = "1px solid turquoise";
    document.getElementById("top-movies").style.border = "1px solid turquoise";

    currentColorTheme = "white";
}

function darkTheme() {
  for (slide of slideOutIds) 
    document.getElementById(slide).style.backgroundColor = "grey";

  document.getElementById('search-header').style.color = "turquoise";
  document.getElementById("sidebar").style.backgroundColor = "grey";
  document.getElementById("theBody").style.backgroundColor = "grey";
  currentColorTheme = "dark"
}

function blueTheme() {
  for (slide of slideOutIds) 
    document.getElementById(slide).style.backgroundColor = "steelblue";

  document.getElementById('search-header').style.color = "white";
  document.getElementById("sidebar").style.backgroundColor = "steelblue";
  document.getElementById("theBody").style.backgroundColor = "navy";
  currentColorTheme = "blue"
}

//function to iterate over all the available containers and slideout menus to open, and shut
//ones as needed
function showHidden(context, context2) {

  //iterate over conatiners and ids and shut them if needed so there is no overlap
  for (container of containerIds) {
      if (context2 != container) {
          if ($("#" + container).hasClass('current')) {
              document.getElementById(container).classList.toggle("current");
          }
      }
  }

  //now for slideOut stuff
  for (slide of slideOutIds) {
      if (context != slide) {
          if ($("#" + slide).hasClass("change")) {
              document.getElementById(slide).classList.toggle("change");
          }
      }
  }

  if (context == 'personal-info')
    document.getElementById("personal-img").style["background-image"] = 'url(../images/' + 
    document.getElementById("avatar-holder").value + '.png)';


  document.getElementById(context).classList.toggle("change");
  document.getElementById(context2).classList.toggle("current");
}

//the starting function for chanhing the theme the user sees on the website. 
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
  
  toggleThemes(context.split("-")[0]);
}

function saveUser() {
  window.location.href = "../auth/theme/" + currentColorTheme + "/" + currentActiveAvatar;
}

//changes the avatar based upon what the user selects
function changeAvatar(avatarId) {
  if (currentActiveAvatar != "none") 
    document.getElementById(currentActiveAvatar).classList.toggle('current-avatar');

  document.getElementById(avatarId).classList.toggle('current-avatar');
  currentActiveAvatar = avatarId;

  document.getElementById("img").style["background-image"] = 'url(../images/' + avatarId + '.png)';
}