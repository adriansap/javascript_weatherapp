
//1. City history buttons
var cities = [];
var inputtedCity = "";
function renderButtons() {

    // Delete the content inside the buttons-view div prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#search-history").empty();
    // Loop through the array of movies, then generate buttons for each movie in the array
    for (i = 0; i < cities.length; i++) {
        var newButton = $("<button>");
        newButton.text(cities[i]);
        newButton.addClass("cities");
        newButton.attr("data-name", cities[i]);
        var breakpg = $("<br>")
        $("#search-history").append(newButton, breakpg);


    }
}

// This function handles events where the add movie button is clicked
$("#search-button").on("click", function (event) {
    // event.preventDefault() prevents submit button from trying to send a form.
    // Using a submit button instead of a regular button allows the user to hit
    // "Enter" instead of clicking the button if desired
    event.preventDefault();
    // Write code to grab the text the user types into the input field
    // Write code to add the new movie into the movies array
    inputtedCity = $("#inputted-city").val();
    cities.push(inputtedCity);
    console.log("cities currently holds: " + cities);

    //set to local storage
    // localStorage.setItem(JSON.stringify("cities history", cities));

    // The renderButtons function is called, rendering the list of movie buttons
    renderButtons();


    //2. AJAX call

    var APIKey = "5be3cfd9c54b7db5d70a69fca9f026e4";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputtedCity + "&appid=" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response) { //after the call, after info is returned, .then ...


        // $("#city-and-date").html(inputtedCity + " " + text(moment().add(10, 'days').calendar()));
        // Create CODE HERE to calculate the temperature (converted from Kelvin)
        $("#temperature").text("Temperature: " + response.main.temp);
        $("#humidity").text("Humidity: " + response.main.humidity);
        $("#windspeed").text("Wind speed: " + response.wind.speed);

        var cTemp = $("<div>").text((parseInt(response.main.temp) - 273.15) * 1.80 + 32);
        $(".temp").append(cTemp);
    })

});

//************************************************************************************* */

