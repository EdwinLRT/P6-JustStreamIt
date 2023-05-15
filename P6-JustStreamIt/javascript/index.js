const mainUrl = "http://localhost:8000/api/v1/titles/";
const categoriesUrl = "http://localhost:8000/api/v1/genres/";
const bestImdbScoresUrl = mainUrl + "?sort_by=-imdb_score";
const bestCategoriesUrls = mainUrl + "?genre=action";

/**
 * Change those parameters to change the display of the home page
 *
 */
const highlightedMovieUrl = mainUrl + "499549";
/** Replace the str to change movie : 499549 : Avatar */
const numberOfBestMovies = 16;
const category1 = "action";
const numberOfMoviesInCategory1 = 14;
const category2 = "Drama";
const numberOfMoviesInCategory2 = 14;
const category3 = "Comedy";
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
    }
    ;
    while (nextPage !== null) {
        let response = await fetch(nextPage);
        response = await response.json();
        nextPage = response.next;
        for (const category of response.results) {
            allCategories.push(category);
        }
    }
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
        
        return bestMovies;
    } catch (error) {
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

/** TESTS */


// const slider = document.querySelector("#carouselInner-topratedmovies")
// const indicators = document.querySelectorAll(".indicator");

// let baseSliderWidth = slider.offsetWidth;
let activeIndex = 0; // the current page on the slider
document.addEventListener('DOMContentLoaded', async () => {
    let movies = await getBestMoviesInCategory(category1, numberOfMoviesInCategory1)

// Fill the slider with all the movies in the "movies" array
    function populateSlider() {
        const newMovieTemplate = document.getElementById("movie0");
        const sliderContent = document.querySelector("#carouselInner-topratedmovies")

        movies.forEach((image, index) => {
            const newMovie = document.createElement("div");
            newMovie.className = "movie";
            newMovie.id = `movie${index}`;

            const img = document.createElement("img");
            img.src = image.image_url;
            img.alt = "Movie Image";
            newMovie.appendChild(img);

            sliderContent.insertBefore(newMovie, sliderContent.lastChild);
        });
    }
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
    });
});

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
            highlightedMovie_img.innerHTML = "<img src=" + data.image_url + " alt=" + data.title + ">";
            highlightedMovie_infos.innerHTML = "<h2>" + data.title + "</h2>" +
                "<div>" + "<h6> Synopsis : </h6>"+"<p>" + data.description + "</p>" + "</div>"+
                "<div>" + "<h6> Réalisateurs : </h6>"+"<p>" + data.writers + "</p>" + "</div>"+
                "<div>" + "<h6> Note IMDB :</h6>"+"<p id='highlightedMovie_score'>" + data.avg_vote + "</p>" + "</div>"+
                "<div>" + "<h6> Genre : </h6>"+"<p>"+ data.genres + "</p>" + "</div>"+
                "<div>" + "<h6> Année : </h6>"+"<p>" +  data.year + "</p>" + "</div>" +
                "<div>" + "<button id='more_button'>"+"Plus d'infos"+"</button>"
                +"<button id='addToList_button'>"+"Ajouter à ma liste"+"</button>" +"</div>";
                
                
        })
        .catch((error) => {
            console.error(error);
        });

}

gethighlightedMovieInfos(highlightedMovieUrl)
