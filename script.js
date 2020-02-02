
//1. City history buttons
var cities = [];
var inputtedCity = "";
var uvIndex;
var cTemp;

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
        // var breakpg = $("<br>")
        $("#search-history").append(newButton);


    }
}


$("#search-button").on("click", function (event) {
    // event.preventDefault() prevents submit button from trying to send a form.
    // Using a submit button instead of a regular button allows the user to hit
    // "Enter" instead of clicking the button if desired
    event.preventDefault();

    inputtedCity = $("#inputted-city").val();
    cities.push(inputtedCity);
    console.log("cities currently holds: " + cities);

    //Set to local storage
    cities_stringy = JSON.stringify(cities);
    localStorage.setItem("cities", cities_stringy);

    //Post City and current Date to jumbotron
    var currentDate = moment().add(10, 'days').calendar(); // [NOT WORKING]
    $("#city-and-date").text(inputtedCity + " " + currentDate); //[NOT WORKING]

    //set to local storage
    // localStorage.setItem(JSON.stringify("cities history", cities));

    // The renderButtons function is called, rendering the list of movie buttons
    renderButtons();

    //3. Get latitude & longitude for city via AJAX call to opencagedata.org
    var APIkey3 = "db63f24d1b984bf9a6b77af5cc2dca28"; //for opencagedata.org
    var queryURL3 = "https://api.opencagedata.com/geocode/v1/json?q=" + inputtedCity + "&key=" + APIkey3


    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL3,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response) { //after the call, after info is returned, .then ...

        console.log(response);
        let cityLat = response.results[0].geometry.lat;
        let cityLon = response.results[0].geometry.lng;
        console.log(cityLat);
        console.log(cityLon);

        //4. AJAX call for UV using lat and lon [CALLBACK STATES UNAUTHORIZED]

        var queryURL4 = "http://api.openweathermap.org/data/2.5/uvi?appid=5be3cfd9c54b7db5d70a69fca9f026e4&lat=" + cityLat + "&lon=" + cityLon
        $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
            url: queryURL4,
            method: "GET" // (GET and POST most commonly used methods.)
        }).then(function (response4) { //after the call, after info is returned, .then ...

            console.log(response4);
            uvIndex = response4.value;
            console.log("uvIndex: " + uvIndex)
            $("#uv-index").text("UV Index :" + uvIndex);


            // $("#uv-index").text(response)

        })

    })

    //2. AJAX call

    var APIKey = "5be3cfd9c54b7db5d70a69fca9f026e4";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + inputtedCity + "&appid=" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response) { //after the call, after info is returned, .then ...

        console.log(response);


        cTemp = Math.floor(((parseInt(response.main.temp) - 273.15) * 1.80 + 32));
        $("#temperature").text("Temperature: " + cTemp);
        $("#humidity").text("Humidity: " + response.main.humidity);
        $("#windspeed").text("Wind speed: " + response.wind.speed);
        // $("#uv-index").text("UV Index :" + uvIndex);

    })

    // 3. AJAX call for 5 day forecast, with special API for such purpose  [CALLBACK STATES UNAUTHORIZED]
    var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + inputtedCity + "," + "United States of America&cnt={5}" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL2,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response2) { //after the call, after info is returned, .then ...

        console.log(response2);

        // $("#plus1day").text(date+1 + response2.day1);
        // $("#plus2day").text("Humidity: " + response.main.humidity);
        // $("#plus3day").text("Wind speed: " + response.wind.speed);
        // $("#plus4day").text("UV Index :" + response.uv)
        // $("#plus5day").text("UV Index :" + response.uv)

    })



    //get 10-day forecast via accuweather api

    // var accuKey = "PaGtWognNrRkyZtpuCF6rMMu78bovZ2M";
    // var queryURL5 = "http://dataservice.accuweather.com/forecasts/v1/daily/10day/" + "{" + inputtedCity + "}" + "&apikey=" + accuKey;

    // $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
    //     url: queryURL5,
    //     method: "GET" // (GET and POST most commonly used methods.)
    // }).then(function (response5) { //after the call, after info is returned, .then ...

    //     console.log(response5);

    // })


});

//************************************************************************************* */

// on click of generated buttons , retrieve info to jumbotron of particular city
$(document).on("click", ".cities", renderInfo); //listen for click on buttons with class .cities, if click execute renderInfo()

function renderInfo() {
    //2. AJAX call
    console.log("this : " + $(this).attr("data-name"));
    var cityButtonClicked = $(this).attr("data-name"); //get attribute which is the city in question that is clicked.

    var APIKey = "5be3cfd9c54b7db5d70a69fca9f026e4";

    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityButtonClicked + "&appid=" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response) { //after the call, after info is returned, .then ...

        console.log(response);

        cTemp = Math.floor(((parseInt(response.main.temp) - 273.15) * 1.80 + 32));

        $("#temperature").text("Temperature: " + cTemp);
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windspeed").text("Wind speed: " + response.wind.speed + "MPH");
        // $("#uv-index").text("UV Index :" + uvIndex)

        //4. AJAX call for UV using lat and lon [CALLBACK STATES UNAUTHORIZED]

        var queryURL4 = "http://api.openweathermap.org/data/2.5/uvi?appid=5be3cfd9c54b7db5d70a69fca9f026e4&lat=" + cityLat + "&lon=" + cityLon
        $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
            url: queryURL4,
            method: "GET" // (GET and POST most commonly used methods.)
        }).then(function (response4) { //after the call, after info is returned, .then ...

            console.log(response4);
            uvIndex = response4.value;
            console.log("uvIndex: " + uvIndex)
            $("#uv-index").text("UV Index :" + uvIndex);


            // $("#uv-index").text(response)

        })
    })


}