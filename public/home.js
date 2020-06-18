function bodyClick(){
    if($("#sidebar").hasClass('change')){
        toggleSidebar();
    }
    if($("#preferences").hasClass('change')) {
      document.getElementById("preferences").classList.toggle('change');
    }
}
function toggleSidebar() {
  document.getElementById("container").style["visibility"] = "hidden";
  document.getElementById('sidebar').classList.toggle('change');
  document.getElementById('main-crap').classList.toggle('blur');
  if (document.getElementById('bar1').style.backgroundColor == 'white') {
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