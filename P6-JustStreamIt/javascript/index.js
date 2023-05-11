const mainUrl = "http://localhost:8000/api/v1/titles/";
const categoriesUrl = "http://localhost:8000/api/v1/genres/";
const bestImdbScoresUrl = mainUrl+"?sort_by=-imdb_score";
const bestCategoriesUrls = mainUrl+"?genre=action";

/**
 * Change those parameters to change the display of the home page
 *
 */
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
 allCategories = getAllCategories()


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
    const topratedmovies = document.getElementById('carouselInner-topratedmovies');
    const listOfMovies = await getBestMovies(bestImdbScoresUrl, numberOfBestMovies);
    buildCarousel(listOfMovies, topratedmovies);

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
