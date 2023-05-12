const mainUrl = "http://localhost:8000/api/v1/titles/";
const categoriesUrl = "http://localhost:8000/api/v1/genres/";
const bestImdbScoresUrl = mainUrl+"?sort_by=-imdb_score";
const bestCategoriesUrls = mainUrl+"?genre=action";

/**
 * Change those parameters to change the display of the home page
 *
 */
const highlightedMovieUrl = mainUrl + "499549"; /** Replace the str to change movie : 499549 : Avatar */
const numberOfBestMovies = 16;
const category1 ="action";
const numberOfMoviesInCategory1 = 14;
const category2 ="Drama";
const numberOfMoviesInCategory2 = 14;
const category3 ="Comedy";
const numberOfMoviesInCategory3 = 14;





function getBestCategories(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response error. API is not responding.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            bestcategorie1.innerHTML = "<h1>Best Categories</h1>" + "<img src=" + data.results[0].image_url + " alt=" + data.results[0].title + ">";
        })
        .catch((error) => {
            console.error(error);
        });
}

async function getAllCategories() {

    let categories = await fetch(categoriesUrl);
    categories = await categories.json();
    let nextPage = categories.next
    let allCategories = [];

    for (const category of categories.results) {
        allCategories.push(category);
    };
    while (nextPage !== null) {
        let response = await fetch(nextPage);
        response = await response.json();
        nextPage = response.next;
        for (const category of response.results) {
            allCategories.push(category);
        }
    }
    console.log(allCategories);
    return allCategories;
}


  /**
     * Get the best movies of all categories
     * @param {string} bestImdbScoresUrl - The url to get the best movies from
     * @returns {array} - An array of movies
     */
async function getBestMovies(bestImdbScoresUrl, limit) {
    try {
        let movies = await fetch(bestImdbScoresUrl);
        movies = await movies.json();
        let nextPage = movies.next;
        let bestMovies = movies.results;

        while (bestMovies.length < limit && nextPage !== null) {
            const response = await fetch(nextPage);
            const data = await response.json();
            nextPage = data.next;
            const additionalMovies = data.results.slice(0, limit - bestMovies.length);
            bestMovies = bestMovies.concat(additionalMovies);
        }

        console.log(bestMovies);
        return bestMovies;
    }
    catch (error) {
        console.error(error);
        return [];
      }
    }

async function getBestMoviesInCategory(category = "action", limit = 14) {
    /**
     * Get the best movies in a category
     * @param {string} category - The category to get the best movies from
     * @param {number} limit - The number of movies to get
     * @returns {array} - An array of movies
     */
    console.log(category);
    let movies = await fetch(mainUrl + "?sort_by=-imdb_score&genre=" + category);
    movies = await movies.json();
    let nextPage = movies.next;
    let categoryBestMovies = [];

    while (categoryBestMovies.length < limit && nextPage !== null) {
        for (const movie of movies.results) {
            categoryBestMovies.push(movie);

            if (categoryBestMovies.length >= limit) {
                break;
            }
        }

        let response = await fetch(nextPage);
        response = await response.json();
        nextPage = response.next;
        movies = response;
    }

    console.log(categoryBestMovies);
    return categoryBestMovies;
}


async function buildCarousel(listOfMovies, htmlContainer) {
  try {
    let carousel = '';

    for (const movie of listOfMovies) {
      carousel += `
        <div class="carousel-item">
            <div class="overlay">
                <h6>${movie.title}</h6>
                <div class="buttons">
                 <button>More...</button>
                </div>
            </div>
            <img src="${movie.image_url}" alt="${movie.title}">
        </div>`;
    }
    htmlContainer.innerHTML = carousel;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
    /** Best categories - display in div id : topratedmovies */
    // const topratedmovies = document.getElementById('carouselInner-topratedmovies');
    // const listOfMovies = await getBestMovies(bestImdbScoresUrl, numberOfBestMovies);
    // buildCarousel(listOfMovies, topratedmovies);

    /** Category 1 - display in div id : category1movies */
    const category1movies = document.getElementById('carouselInner-category1movies');
    const bestMoviesinCat1 = await getBestMoviesInCategory(category1, numberOfMoviesInCategory1);
    buildCarousel(bestMoviesinCat1, category1movies)

    /** Category 2 - display in div id : category2movies */
    const category2movies = document.getElementById('carouselInner-category2movies');
    const bestMoviesinCat2 = await getBestMoviesInCategory(category2, numberOfMoviesInCategory2);
    buildCarousel(bestMoviesinCat2, category2movies)

    /** Category 3 - display in div id : category3movies */
    const category3movies = document.getElementById('carouselInner-category3movies');
    const bestMoviesinCat3 = await getBestMoviesInCategory(category3, numberOfMoviesInCategory3);
    buildCarousel(bestMoviesinCat3, category3movies)

});

/**  CAROUSEL  */
// document.addEventListener('DOMContentLoaded', function() {
//     // Sélectionnez les éléments du DOM nécessaires
//     const carouselInner = document.getElementById('carouselInner-topratedmovies');
//     const prevButton = document.getElementById('carouselPrev');
//     const nextButton = document.getElementById('carouselNext');
//
//     // Définissez les variables nécessaires pour le fonctionnement du slider
//     let currentPosition = 0;
//     const slideWidth = 600; // Largeur d'un élément de slide en pixels
//
//     // Ajoutez les écouteurs d'événements pour les boutons précédent et suivant
//     prevButton.addEventListener('click', slidePrev);
//     nextButton.addEventListener('click', slideNext);
//
//     // Fonction pour faire défiler le slider vers la gauche (précédent)
//     function slidePrev() {
//         console.log("left")
//         currentPosition += slideWidth;
//         carouselInner.style.transform = `translateX(${currentPosition}px)`;
//     }
//
//     // Fonction pour faire défiler le slider vers la droite (suivant)
//     function slideNext() {
//         console.log("right")
//         currentPosition -= slideWidth;
//         carouselInner.style.transform = `translateX(${currentPosition}px)`;
//     }
// });

/**  CAROUSEL  */

/** TESTS */


// const slider = document.querySelector("#carouselInner-topratedmovies")
// const indicators = document.querySelectorAll(".indicator");

// let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider

let movies = [
  {
    src:
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1579566346927-c68383817a25?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },

  {
    src:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=674&q=80",
  },

  {
    src:
      "https://images.unsplash.com/photo-1617182635496-c5c474367085?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1611419010196-a360856fc42f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1518715303843-586e350765b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1617258683488-df59909f25f0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=644&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1543862809-2c9e0bcdc075?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=564&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1579156412503-f22426cc6386?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1352&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1514068574489-503a8eb91592?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1390&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1521714161819-15534968fc5f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1572188863110-46d457c9234d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1579702455224-c0dd4ac78234?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1369&q=80",
  },

  {
    src:
      "https://images.unsplash.com/photo-1575470180257-7183ddca844f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=701&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1584253660192-de72b033c220?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1611523792722-16952e48cffa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
  },
  {
    src:
      "https://images.unsplash.com/photo-1536300007881-7e482242baa5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
];

// Fill the slider with all the movies in the "movies" array
function populateSlider() {
const newMovieTemplate = document.getElementById("movie0");
  const sliderContent = document.querySelector("#carouselInner-topratedmovies")

  movies.forEach((image, index) => {
    const newMovie = document.createElement("div");
    newMovie.className = "movie";
    newMovie.id = `movie${index}`;

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = "Movie Image";
    newMovie.appendChild(img);

    sliderContent.insertBefore(newMovie, sliderContent.lastChild);
  });
}
document.addEventListener('DOMContentLoaded', function() {
    populateSlider();
    const slider = document.querySelector("#carouselInner-topratedmovies")
    const indicators = document.querySelectorAll(".indicator");
    const btnLeft = document.getElementById("carouselPrev");
    const btnRight = document.getElementById("carouselNext");

    function updateIndicators(index) {
        indicators.forEach((indicator) => {
        indicator.classList.remove("active");
        });
        let newActiveIndicator = indicators[index];
        newActiveIndicator.classList.add("active");
    }


  btnLeft.addEventListener("click", (e) => {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies.

  slider.scrollBy({
    top: 0,
    left: -scrollDistance,
    behavior: "smooth",
  });
  activeIndex = (activeIndex - 1) % 3;
  console.log(activeIndex);
  updateIndicators(activeIndex);
});
  btnRight.addEventListener("click", (e) => {
  let movieWidth = document.querySelector(".movie").getBoundingClientRect()
    .width;
  let scrollDistance = movieWidth * 6; // Scroll the length of 6 movies.

  console.log(`movieWidth = ${movieWidth}`);
  console.log(`scrolling right ${scrollDistance}`);

  // if we're on the last page
  if (activeIndex == 2) {
    // duplicate all the items in the slider (this is how we make 'looping' slider)
    populateSlider();
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = 0;
    updateIndicators(activeIndex);
  } else {
    slider.scrollBy({
      top: 0,
      left: +scrollDistance,
      behavior: "smooth",
    });
    activeIndex = (activeIndex + 1) % 3;
    console.log(activeIndex);
    updateIndicators(activeIndex);
  }
}   );
});

// delete the initial movie in the html
// const initialMovie = document.getElementById("movie0");
// initialMovie.remove();





/** TESTS */

async function gethighlightedMovieInfos(highlightedMovieUrl) {
    fetch(highlightedMovieUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response error. API is not responding.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            highlightedMovieImg.innerHTML ="<img src=" + data.image_url + " alt=" + data.title + ">";
            highlightedMovieInfos.innerHTML= "<h2>" + data.title + "</h2><p>" + data.genres + "</p><p>" + data.release_date + "</p><p>" + data.rated + "</p><p>" + data.rating + "</p><p>" + data.description + "</p>";
        })
        .catch((error) => {
            console.error(error);
        });

}
gethighlightedMovieInfos(highlightedMovieUrl)
