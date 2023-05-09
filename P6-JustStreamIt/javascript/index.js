const mainUrl = "http://localhost:8000/api/v1/titles/";
const categoriesUrl = "http://localhost:8000/api/v1/genres/";
const bestMovieUrl = mainUrl+"?sort_by=-imdb_score";
const bestCategoriesUrls = mainUrl+"?genre=action";

fetch(mainUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response error. API is not responding.");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((error) => {
        console.error(error);
    });

function getBestMovie(bestMovieUrl) {
    fetch(bestMovieUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response error. API is not responding.");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            bestmovie.innerHTML = "<h1>Best Movie</h1>" + "<img src=" + data.results[0].image_url + " alt=" + data.results[0].title + ">";
        })
        .catch((error) => {
            console.error(error);
        });
}

// getBestMovie(bestMovieUrl)

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
// getBestCategories(bestCategoriesUrls)

// async function moviesCarousel() {
//     const response = await fetch(mainUrl);
//     const data = await response.json();
//     console.log(data);
//     const results = data.results;
//     console.log(results);
//     const movies = document.getElementById("movies");
//     console.log(movies);
//     let carousel = "";
//     for (let i = 0; i < results.length; i++) {
//         carousel += "<div class='carousel-item'><img src=" + results[i].image_url + " alt=" + results[i].title + "></div>";
//     }
//     movies.innerHTML = carousel;
// }

async function getAllCategories() {

    categories = await fetch(categoriesUrl);
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

async function getMoviesInCategory(category = "action") {
    categoryUrl = mainUrl + "?genre=" + category;
    const response = await fetch(categoryUrl);
    const data = await response.json();
    console.log(data);
    const results = data.results;
    console.log(results);
    for (const movie of results) {
        console.log(movie);
    }
    return results;
}
getMoviesInCategory()

// async function buildCarousel() {
//
//     results = await getMoviesInCategory();
//     for (const movie of results) {
//         console.log(movie);
//         let carousel = document.createElement("carousel");
//         carousel.classList.add("carousel-item");
//         let img = document.createElement("img");
//         img.src = movie.image_url;
//         img.alt = movie.title;
//         let title = document.createElement("h6");
//         title.innerHTML = movie.title;
//         carousel.appendChild(img);
//         carousel.appendChild(title);
//         bestcategorie1.appendChild(carousel);
//     }
//
// };
//
//
// buildCarousel();
