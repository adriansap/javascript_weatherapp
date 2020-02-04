
//1. City history buttons
var cities = [];
var inputtedCity;
var uvIndex;
var cTemp;
var retrieveCities;

function renderButtonsOnLoad() {
    retrieveCities = localStorage.getItem("cities");
    var parsedCitiesToArray = JSON.parse(retrieveCities);
    console.log("parsed cities: " + parsedCitiesToArray);
    if (parsedCitiesToArray != null) {
        for (i = 0; i < parsedCitiesToArray.length; i++) {
            var newButton = $("<button>");
            newButton.text(parsedCitiesToArray[i]);
            newButton.addClass("cities");
            newButton.attr("data-name", parsedCitiesToArray[i]);
            $("#search-history").append(newButton)
            cities.push(parsedCitiesToArray[i]); //flag
        }
    }
}

window.onload = function () {
    renderButtonsOnLoad(); //to render buttons from localstorage, on page refresh, for instance. [not working]

};

function renderButtons() {

    // Delete the content inside the buttons-view div prior to adding new cities
    // (this is necessary otherwise you will have repeat buttons)
    $("#search-history").empty();
    // Loop through the array of movies, then generate buttons for each movie in the array
    for (i = 0; i < cities.length; i++) {
        var newButton = $("<button>");
        newButton.text(cities[i]);
        newButton.addClass("cities");
        newButton.attr("data-name", cities[i]);
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
    localStorage.setItem("cities", cities_stringy); // flag

    //Post City and current Date to jumbotron
    var currentDate = moment().format('L');
    $("#city-and-date").text(inputtedCity + " " + currentDate);


    // The renderButtons function is called, rendering the list of history buttons
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
        // var icon1 = response2.weather[0].icon


        // $("#iconMain").attr("src", "http://openweathermap.org/img/wn/" + icon1 + "@2x.png");

        cTemp = Math.floor(((parseInt(response.main.temp) - 273.15) * 1.80 + 32));
        $("#temperature").text("Temperature: " + cTemp + "F");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windspeed").text("Wind speed: " + response.wind.speed + "MPH");
        // $("#uv-index").text("UV Index :" + uvIndex);

    })

    // 3. AJAX call for 5 day forecast, with special API for such purpose  [CALLBACK STATES UNAUTHORIZED]
    var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + inputtedCity + "," + "us" + "&appid=" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL2,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response2) { //after the call, after info is returned, .then ...

        console.log(response2);
        cTemp1 = Math.floor(((parseInt(response2.list[0].main.temp) - 273.15) * 1.80 + 32));

        var oneDaysForward = moment().add(1, 'day');
        $("#plus1day").html(
            oneDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp1 + "F" + "<br>" +
            "Humidity :" + response2.list[0].main.humidity + "<br>" +
            "Wind speed :" + response2.list[0].wind.speed + "<br>"
        );

        cTemp2 = Math.floor(((parseInt(response2.list[1].main.temp) - 273.15) * 1.80 + 32));

        var twoDaysForward = moment().add(2, 'day');
        $("#plus2day").html(
            twoDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp2 + "F" + "<br>" +
            "Humidity :" + response2.list[1].main.humidity + "<br>" +
            "Wind speed :" + response2.list[1].wind.speed

        );
        cTemp3 = Math.floor(((parseInt(response2.list[2].main.temp) - 273.15) * 1.80 + 32));

        var threeDaysForward = moment().add(3, 'day');

        $("#plus3day").html(
            threeDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp3 + "F" + "<br>" +
            "Humidity :" + response2.list[2].main.humidity + "<br>" +
            "Wind speed :" + response2.list[2].wind.speed + "<br>"

        );

        cTemp4 = Math.floor(((parseInt(response2.list[3].main.temp) - 273.15) * 1.80 + 32));

        var fourDaysForward = moment().add(4, 'day');

        $("#plus4day").html(
            fourDaysForward.format('dddd MMMM DD') + "<br>" +

            "Temperature :" + cTemp4 + "F" + "<br>" +
            "Humidity :" + response2.list[3].main.humidity + "<br>" +
            "Wind speed :" + response2.list[3].wind.speed + "<br>"
        )

        cTemp5 = Math.floor(((parseInt(response2.list[4].main.temp) - 273.15) * 1.80 + 32));

        var fiveDaysForward = moment().add(5, 'day');

        $("#plus5day").text(
            fiveDaysForward.format('dddd MMMM DD') + "<br>" +

            "Temperature :" + cTemp5 + "F" + "<br>" +
            "Humidity :" + response2.list[4].main.humidity + "<br>" +
            "Wind speed :" + response2.list[4].wind.speed + "<br>"

        );

    })




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
        var currentDate = moment().format('L');
        $("#city-and-date").text(cityButtonClicked + " " + currentDate); //[NOT UPDATING/WORKING]
        cTemp = Math.floor(((parseInt(response.main.temp) - 273.15) * 1.80 + 32));
        $("#temperature").text("Temperature: " + cTemp);
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#windspeed").text("Wind speed: " + response.wind.speed + "MPH");
        // $("#uv-index").text("UV Index :" + uvIndex)


        //4. AJAX call for UV using lat and lon 

        var queryURL4 = "http://api.openweathermap.org/data/2.5/uvi?appid=5be3cfd9c54b7db5d70a69fca9f026e4&lat=" + cityLat + "&lon=" + cityLon
        $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
            url: queryURL4,
            method: "GET" // (GET and POST most commonly used methods.)
        }).then(function (response4) { //after the call, after info is returned, .then ...

            console.log(response4);
            uvIndex = response4.value;
            console.log("uvIndex: " + uvIndex)
            $("#uv-index").text("UV Index :" + uvIndex);



        })
    })

    // 3. AJAX call for 5 day forecast, with special API for such purpose  [CALLBACK STATES UNAUTHORIZED]
    var queryURL2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityButtonClicked + "," + "us" + "&appid=" + APIKey;

    $.ajax({ //make API call (ajax = Asynchronous Javascript And XML)
        url: queryURL2,
        method: "GET" // (GET and POST most commonly used methods.)
    }).then(function (response2) { //after the call, after info is returned, .then ...

        console.log(response2);

        cTemp1 = Math.floor(((parseInt(response2.list[0].main.temp) - 273.15) * 1.80 + 32));


        var oneDaysForward = moment().add(1, 'day');
        $("#plus1day").html(
            oneDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp1 + "F" + "<br>" +
            "Humidity :" + response2.list[0].main.humidity + "%" + "<br>" +
            "Wind speed :" + response2.list[0].wind.speed + "MPH" + "<br>"
        );
        // .html(`<h1>${cTemp1}</h1>`)

        cTemp2 = Math.floor(((parseInt(response2.list[1].main.temp) - 273.15) * 1.80 + 32));

        var twoDaysForward = moment().add(2, 'day');
        $("#plus2day").html(
            twoDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp2 + "F" + "<br>" +
            "Humidity :" + response2.list[1].main.humidity + "%" + "<br>" +
            "Wind speed :" + response2.list[1].wind.speed + "MPH" + "<br>"

        );

        cTemp3 = Math.floor(((parseInt(response2.list[2].main.temp) - 273.15) * 1.80 + 32));

        var threeDaysForward = moment().add(3, 'day');

        $("#plus3day").html(
            threeDaysForward.format('dddd MMMM DD') + "<br>" +
            "Temperature :" + cTemp3 + "F" + "<br>" +
            "Humidity :" + response2.list[2].main.humidity + "%" + "<br>" +
            "Wind speed :" + response2.list[2].wind.speed + "MPH" + "<br>"

        );

        cTemp4 = Math.floor(((parseInt(response2.list[3].main.temp) - 273.15) * 1.80 + 32));

        var fourDaysForward = moment().add(4, 'day');


        $("#plus4day").html(
            fourDaysForward.format('dddd MMMM DD') + "<br>" +

            "Temperature :" + cTemp4 + "F" + "<br>" +
            "Humidity :" + response2.list[3].main.humidity + "%" + "<br>" +
            "Wind speed :" + response2.list[3].wind.speed + "MPH" + "<br>"
        )

        cTemp5 = Math.floor(((parseInt(response2.list[4].main.temp) - 273.15) * 1.80 + 32));

        var fiveDaysForward = moment().add(5, 'day');

        $("#plus5day").html(
            fiveDaysForward.format('dddd MMMM DD') + "<br>" +

            "Temperature :" + cTemp5 + "F" + "<br>" +
            "Humidity :" + response2.list[4].main.humidity + "%" + "<br>" +
            "Wind speed :" + response2.list[4].wind.speed + "MPH" + "<br>"

        );

    })


}