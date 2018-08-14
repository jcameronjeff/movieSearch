//Declare DOM elements as globals to avoid multiple calls.
const movieForm = document.getElementById("movieForm");
const movieTitle = document.getElementById('movieSearch');
const resultsContainer = document.getElementById('results');
const detailsContainer = document.getElementById('details');

// Create an empty array to hold our list of titles.
let movieList = [];

// Helper Function to clear DOM elements before adding anything.
const emptyDivs = () => {
    resultsContainer.innerHTML = '';
    detailsContainer.innerHTML = '';
}

// Add a listener to retrieve the move title when the form is submitted.
movieForm
    .addEventListener("submit", function (event) {
        event.preventDefault();

        //Pull the title from the form input.
        let title = movieTitle.value;
        console.log(title);

        //Pass the title to the OMDB API search function.
        omdbSearch(title);

    });

// Search function to retrieve titles from the OMDB API.
const omdbSearch = data => {

    //Clear the DOM before rendering the new titles.
    emptyDivs();

    // Set the query url to include the title passed to the function. Concatenate
    // using template literals in ES6 with backticks.
    let queryUrl = `https://www.omdbapi.com/?s=${data}&page=1&apikey=6e2186b9`;

    //Use the Javascript Fetch API to retrieve the data. WILL NOT WORK in I.E.
    fetch(queryUrl).then(response => {
        //parse the results to json
        return response.json();
    }).then((results) => {

        //Set the results to a new array with Array.map
        let searchResults = results
            .Search
            .map(result => result.Title);

        // Pass the results to a function that displays them to the DOM. Pass a second
        // parameter to indicate that the data is coming from the API.
        showList(searchResults, "search");
    });
}

// Display list of titles to in the Results div.
const showList = (list, search) => {

    //Call the helper function to clear the way for new data in the DOM.
    emptyDivs();

    // Iterate through titles passed to the function and create DOM elements for
    // each.
    list.forEach(title => {
        console.log(title);
        var div = document.createElement("h5");
        div.className = ('card card-body');
        div
            .classList
            .add("movie-title");
        div.innerHTML = title;

        //append each title to the results DIV we declared as a global.
        resultsContainer.appendChild(div);

        // Set an event listener to show the details of each title. Pass the element as
        // the first parameter. Pass the conditional "search" so the function knows
        // whether to add a 'favorite' button.'
        div.addEventListener("click", e => showDetails(e, search));
    });

}

// Display a movie's details to the details div.
const showDetails = (event, search) => {

    let title = event.target.innerText;
    //Use the 't' option to get more details from the OMDB API.
    let detailUrl = `https://www.omdbapi.com/?t=${title}&page=1&apikey=6e2186b9`;

    fetch(detailUrl).then(function (response) {
        return response.json();
    }).then((results) => {

        let details = results;

        // Build our HTML for displaying the desired details. Set it to the innerHTML of
        // the 'Details' div. Use a conditional statement to determine whether to add
        // the 'favorite' button.
        detailsContainer.innerHTML = `<h3> ${search
            ? `<button value="${details.Title}" class='btn btn-danger' id='favorite'><i class="fa fa-heart"></i></button>`
            : ""} ${details.Title} (${details.Year})</h3><hr><p>${details.Actors}</p><hr><img src="${details.Poster}" width="250px" class="float-left mr-2"> <h4>Plot:  </h4><p>${details.Plot}</p>`;

        //Use another conditional to add the 'favorite' event listener.
        if (search) {
            let favButton = document.getElementById('favorite');
            favButton.addEventListener('click', save);
        }

    });

}

// Save a title to the favorites list.
const save = event => {
    event.preventDefault();

    //Get the title from the favorite button's value.
    var favTitle = document
        .getElementById('favorite')
        .value;

    //Set the data object to be passed to the server.
    var data = {
        title: favTitle
    };

    console.log(data.title)
    //Set the Fetch API method to 'POST' to send the data to the server.
    fetch("/favorite", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => console.log('Success:', response))
        .catch(error => console.error('Error:', error));
}

// Get the user favorites from the server and pass them to the show list
// function.
const showFavorites = () => {
    movieList = [];

    fetch("/favorites", {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            // Set the response to a new array with the Map method.
            response = response.map(element => element.title);
            //Pass the new array to be displayed on the DOM.
            showList(response);
            //
        })
        .catch(error => console.error('Error:', error));

}

// Set up the Nav Bar to toggle between search and favorites. Declare the
// toggleList function before its listener.
const toggleList = () => {

    emptyDivs();

    if (event.target.innerText === "Favorites") {
        showFavorites()
    }

}

// Create an array from menu items and add a listener to each.
let menuLink = Array.from(document.getElementsByClassName('toggleList'));
menuLink.forEach(link => link.addEventListener('click', toggleList));