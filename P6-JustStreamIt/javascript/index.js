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
 * Get the highlighted movie infos
 * @param highlightedMovieUrl
 * @returns {Promise<void>}
 */
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
                "<div>" + "<h6> Synopsis : </h6>" + "<p>" + data.description + "</p>" + "</div>" +
                "<div>" + "<h6> Réalisateurs : </h6>" + "<p>" + data.writers + "</p>" + "</div>" +
                "<div>" + "<h6> Note IMDB :</h6>" + "<p id='highlightedMovie_score'>" + data.avg_vote + "</p>" + "</div>" +
                "<div>" + "<h6> Genre : </h6>" + "<p>" + data.genres + "</p>" + "</div>" +
                "<div>" + "<h6> Année : </h6>" + "<p>" + data.year + "</p>" + "</div>" +
                "<div>" + "<button id='more_button'>" + "Plus d'infos" + "</button>"
                + "<button id='addToList_button'>" + "Ajouter à ma liste" + "</button>" + "</div>";


        })
        .catch((error) => {
            console.error(error);
        });

}
gethighlightedMovieInfos(highlightedMovieUrl)


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
    console.log(movies)
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

// Fill the slider with all the movies in the "movies" array
function populateSlider(movies, slider, carousel) {
    const newMovieTemplate = document.getElementById("movie0");
    const sliderContent = document.querySelector(carousel);

    movies.forEach((image, index) => {
        console.log(image)
        const newMovie = document.createElement("div");
        newMovie.className = "movie";
        newMovie.id = `movie${index}`;

        const movieId = document.createElement("p");
        movieId.className = "movie_id";
        movieId.textContent = image.id;
        newMovie.appendChild(movieId);

        const img = document.createElement("img");
        img.className = "movie_img";
        img.alt = "Movie Image";
        img.onerror = function () {
            img.src = "./images/placeholder_movie.png";
        };
        img.src = image.image_url;
        newMovie.appendChild(img);

        const title = document.createElement("h3");
        title.className = "movie_title";
        title.textContent = image.title;
        newMovie.appendChild(title);
        const description = document.createElement("p");
        description.className = "movie_description";
        description.textContent = image.description;
        newMovie.appendChild(description);


        newMovie.onclick = function () {
            openModal(newMovie); // Passer l'élément newMovie en tant que paramètre
        };

        sliderContent.insertBefore(newMovie, sliderContent.lastChild);

    });
    return sliderContent;
}


let activeIndex = 0;

function btnLeft(slider) {
    let movieWidth = slider.querySelector(".movie").getBoundingClientRect().width;
    let scrollDistance = movieWidth * 4; // Scroll the length of 6 movies.

    slider.scrollBy({
        top: 0,
        left: -scrollDistance,
        behavior: "smooth",
    });

    activeIndex = (activeIndex - 1) % 3;
    console.log(activeIndex);
    //updateIndicators(activeIndex);
}

function btnRight(slider, movies, slider, carousel) {
    let movieWidth = slider.querySelector(".movie").getBoundingClientRect().width;
    let scrollDistance = movieWidth * 4; // Scroll the length of 6 movies.

    console.log(`movieWidth = ${movieWidth}`);
    console.log(`scrolling right ${scrollDistance}`);

    // if we're on the last page
    if (activeIndex == 2) {
        populateSlider(movies, slider, carousel); // duplicate all the items in the slider (this is how we make 'looping' slider)
        slider.scrollBy({
            top: 0,
            left: +scrollDistance,
            behavior: "smooth",
        });

        activeIndex = 0;
        //updateIndicators(activeIndex);
    } else {
        slider.scrollBy({
            top: 0,
            left: +scrollDistance,
            behavior: "smooth",
        });

        activeIndex = (activeIndex + 1) % 3;
        console.log(activeIndex);
        //updateIndicators(activeIndex);
    }
}


//
// MODAL
//

// OPEN MODAL
function openModal(movie) {
    // Récupérer l'id du film
    var movieId = movie.querySelector(".movie_id").textContent;
    var modal = document.getElementById("myModal");
    var modalImage = document.getElementById("modalImg");
    var modalTitle = document.getElementById("modalTitle");
    var modalImdbScore = document.getElementById("modalImdbScore");
    var modalRated = document.getElementById("modalRated");
    var modalPublished = document.getElementById("modalPublished");
    var modalGenres = document.getElementById("modalGenres");
    var modalActors = document.getElementById("modalActors");
    var modalDirectors = document.getElementById("modalDirectors");
    var modalDescription = document.getElementById("modalDescription");
    var modalDuration = document.getElementById("modalDuration");
    var modalCountry = document.getElementById("modalCountries");

    // Faire une requête fetch pour obtenir les données du film
    fetch(mainUrl + movieId)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            //Update the modal content
            modalImage.src = data.image_url;
            modalTitle.textContent = data.original_title;
            modalDescription.innerHTML = "Description : "+ "<br>" + data.description;
            modalImdbScore.textContent = "Note IMDB : " + data.imdb_score;
            modalRated.textContent = "Rated : " + (data.rated === "Not rated or unkown rating" ? "Non renseigné" : data.rated);
            modalPublished.textContent = "Date de sortie : " + data.date_published;
            modalDuration.textContent = "Durée : " + data.duration + " minutes"
            modalBoxOffice.textContent = "Box Office : " + (data.worldwide_gross_income ? data.worldwide_gross_income : "Non renseigné");
            modalGenres.textContent = "Genres : " + data.genres;
            modalActors.innerHTML = "Acteurs : "+"<br>" + data.actors;
            modalDirectors.textContent = "Réalisateurs : " + data.directors;
            modalCountry.textContent = "Pays : " + data.countries.join(", ");
        })
        .catch(error => {
            console.log("Erreur lors de la récupération des données du film :", error);
        });


    modalImage.src = movie.querySelector(".movie_img").src;
    modalTitle.textContent = movie.querySelector(".movie_title").textContent;
    // modalImdbScore.textContent = "Note : " + movie.querySelector(".movie_imdbScore").textContent;
    // modalYear.textContent = "Année : " + movie.querySelector(".movie_year").textContent;
    // modalGenres.textContent = "Genres : " + movie.querySelector(".movie_genres").textContent;
    // modalActors.textContent = "Acteurs : " + movie.querySelector(".movie_actors").textContent;
    // modalDirectors.textContent = "Réalisateurs : " + movie.querySelector(".movie_directors").textContent;
    modalDescription.textContent = movie.querySelector(".movie_description").textContent;

    modal.style.display = "block";
}

// CLOSE MODAL
function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Add event listener to close modal when click is outside of modal
document.addEventListener("click", function (event) {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");

    // is click outside modal
    if (event.target === modal) {
        // Fermer la modal en masquant son affichage
        modal.style.display = "none";
    }
});


document.addEventListener('DOMContentLoaded', async () => {


    let movies_topRated = await getBestMovies(bestImdbScoresUrl, numberOfBestMovies);
    let movies_category1 = await getBestMoviesInCategory(category1, numberOfMoviesInCategory1);
    let movies_category2 = await getBestMoviesInCategory(category2, numberOfMoviesInCategory2);
    let movies_category3 = await getBestMoviesInCategory(category3, numberOfMoviesInCategory3);

    let carousel_topRated = '#carouselInner-topratedmovies';
    let carousel_category1 = "#carouselInner-category1";
    let carousel_category2 = "#carouselInner-category2";
    let carousel_category3 = "#carouselInner-category3";

    const sliderTopRatedMovies = document.querySelector("#carouselInner-topratedmovies");
    const sliderCategory1 = document.querySelector("#carouselInner-category1");
    const sliderCategory2 = document.querySelector("#carouselInner-category2");
    const sliderCategory3 = document.querySelector("#carouselInner-category3");

    populateSlider(movies_topRated, sliderTopRatedMovies, carousel_topRated);
    populateSlider(movies_category1, sliderCategory1, carousel_category1);
    populateSlider(movies_category2, sliderCategory2, carousel_category2);
    populateSlider(movies_category3, sliderCategory3, carousel_category3);


    const indicators = document.querySelectorAll(".indicator");
    const btnLeftTopRatedMovies = document.getElementById("carouselPrev");
    const btnRightTopRatedMovies = document.getElementById("carouselNext");
    const btnLeftCategory1 = document.getElementById("carouselPrev-category1");
    const btnRightCategory1 = document.getElementById("carouselNext-category1");
    const btnLeftCategory2 = document.getElementById("carouselPrev-category2");
    const btnRightCategory2 = document.getElementById("carouselNext-category2");
    const btnLeftCategory3 = document.getElementById("carouselPrev-category3");
    const btnRightCategory3 = document.getElementById("carouselNext-category3");


    btnLeftTopRatedMovies.addEventListener("click", (e) => {
        btnLeft(sliderTopRatedMovies, movies_topRated, sliderTopRatedMovies, carousel_topRated);
    });

    btnRightTopRatedMovies.addEventListener("click", (e) => {
        btnRight(sliderTopRatedMovies, movies_topRated, sliderTopRatedMovies, carousel_topRated);
    });

    btnLeftCategory1.addEventListener("click", (e) => {
        btnLeft(sliderCategory1, movies_category1, sliderCategory1, carousel_category1);
    });

    btnRightCategory1.addEventListener("click", (e) => {
        btnRight(sliderCategory1, movies_category1, sliderCategory1, carousel_category1);
    });

    btnLeftCategory2.addEventListener("click", (e) => {
        btnLeft(sliderCategory2, movies_category2, sliderCategory2, carousel_category2);
    });

    btnRightCategory2.addEventListener("click", (e) => {
        btnRight(sliderCategory2, movies_category2, sliderCategory2, carousel_category2);
    });

    btnLeftCategory3.addEventListener("click", (e) => {
        btnLeft(sliderCategory3, movies_category3, sliderCategory3, carousel_category3);
    });

    btnRightCategory3.addEventListener("click", (e) => {
        btnRight(sliderCategory3, movies_category3, sliderCategory3, carousel_category3);
    });

});



