$(document).ready(function() {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(currentDay);
    
    var cityInputEl = $("#cityInput");
    var cityListEl = $(".cityList");
    var cityHeaderEl = $(".cityHeader");
    var currentDisplay = $(".currentInfo");
    var currentList = $(".currentList");
    var day1El = $(".day1");
    var day2El = $(".day2");
    var day3El = $(".day3");
    var day4El = $(".day4");
    var day5El = $(".day5");
    

    function displayCitiesList(){
        var cityListDisplay = JSON.parse(localStorage.getItem("cities"))
             
        if (cityListDisplay) {
            for (i = 0; i < cityListDisplay.length; i++) {
               
                var cityListItem = $("<li>");
                                
                cityListItem.addClass("list-group-item");
                cityListItem.addClass("cityClick");
        
                cityListEl.append(cityListItem);
            }
        }
    }
    
    displayCitiesList();

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentList.empty();
        currentDisplay.empty();

        day1El.empty();
        day2El.empty();
        day3El.empty();
        day4El.empty();
        day5El.empty();

    // get value of search box and set it to the variable "cityName"
        var cityInput = $(this).siblings("#cityInput").val();
        var cityName = cityInput.toLowerCase();

    // save city on local storage
        function saveCities(citySaved){

            var prevCities = JSON.parse(localStorage.getItem("cities")) || [];

                      
            var newCities = JSON.stringify(prevCities);
            localStorage.setItem("cities", newCities);
            
            // create list element with the city name and append to the ul
            
            
            var newCityListItem = $("<li>");
                newCityListItem.text(citySaved.charAt(0) + citySaved.slice(1)) 
                // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
                newCityListItem.addClass("list-group-item");
                newCityListItem.addClass("cityClick");
                cityListEl.append(newCityListItem);
        
    
        }

        saveCities(cityName);

        getData(cityName);

        // clear the value of the search box
        cityInputEl.val("");
    })


    $(document).on("click", ".cityClick", function(event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentList.empty();
        currentDisplay.empty();

        day1El.empty();
        day2El.empty();
        day3El.empty();
        day4El.empty();
        day5El.empty();


        //console.log("city clicked");

        var cityClickName = $(this).text();
        console.log(this);
        console.log(cityClickName);

        getData(cityClickName);

    })


    function getData (cityChoice) {
        
        //fetch specific lat/long data from whatever city name is passed into this function
        let apiKey = "9bd0e1b11f3879904bad098830aa5bb2";
        var currentWeatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityChoice + "&units=imperial&appid=" + apiKey;
    

        fetch(currentWeatherLink)
            
            .then(function(response) {
                return response.json();
            })

            //Display current weather data to weather display area
            .then(function(data) {

            // to get the info for the One Call Api you need lat/long
            // stack overflow: https://stackoverflow.com/questions/40981040/using-a-fetch-inside-another-fetch-in-javascript 
                console.log(data);

                var cityLat = data.city.coord.lat;
                var cityLon = data.city.coord.lon;
                var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;
                
                //add text content to display area
                var cityHeader = $("<h2>");
                cityHeader.text(data.city.name);
                cityHeaderEl.append(cityHeader);

                return fetch(oneCall);
            })

            .then(function(response) {
                return response.json();
            })

            .then(function(data){
                //console.log(data);

                
                var weatherDescription = $("<li>");
                weatherDescription.text("Current Weather: " + data.current.weather[0].description);
                weatherDescription.addClass("list-group-item");
                currentDisplay.append(weatherDescription);

               
                var weatherTemp = $("<li>");
                weatherTemp.text("Temperature: " + data.current.temp + "°F"); // "&#8457"
                weatherTemp.addClass("list-group-item");
                currentDisplay.append(weatherTemp);

                
                var weatherHumid = $("<li>");
                weatherHumid.text("Humidity: " + data.current.humidity + "%");
                weatherHumid.addClass("list-group-item");
                currentDisplay.append(weatherHumid);

                
                var WindSpd = $("<li>");
                WindSpd.text("Wind Speed: " + data.current.wind_speed + "mph");
                WindSpd.addClass("list-group-item");
                currentDisplay.append(WindSpd);

                //UV Index
                var UvIndx = $("<li>");
                var rawUvIndx =$("<span>")

                rawUvIndx.text(data.current.uvi);
                rawUvIndx.addClass("badge");
                UvIndx.text("UV Index: ");
                UvIndx.addClass("list-group-item");
                
                // make value of the uv index an integer
                var intUvIndx = parseInt(data.value);

                if (intUvIndx >= 11) {
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("exHigh");
                } else if (intUvIndx < 11 && intUvIndx >= 8) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("veryHigh");
                } else if (intUvIndx < 8 && intUvIndx >= 6) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("high");
                } else if (intUvIndx < 6 && intUvIndx >= 4) {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("low");
                    rawUvIndx.addClass("med");
                } else {
                    rawUvIndx.removeClass("exHigh");
                    rawUvIndx.removeClass("veryHigh");
                    rawUvIndx.removeClass("high");
                    rawUvIndx.removeClass("med");
                    rawUvIndx.addClass("low");
                }

                UvIndx.append(rawUvIndx);
                currentDisplay.append(UvIndx); 

                
                forecast(1, day1El);
                forecast(2, day2El);
                forecast(3, day3El);
                forecast(4, day4El);
                forecast(5, day5El);

                function forecast(dayNum, dayEl) {
                    var index = parseInt(dayNum)

                    var dayDate = $("<p>");
                    dayDate.text(moment.unix(data.daily[index].dt).format('ddd')); 
                    dayEl.append(dayDate);

                    var dayIcon = $("<img>");
                    var iconcode = data.daily[index].weather[0].icon;
                    dayIcon.attr("src", "http://openweathermap.org/img/w/" + iconcode + ".png");
                    dayEl.append(dayIcon);

                    var dayTemp = $("<p>");
                    dayTemp.text("Temp: " + data.daily[index].temp.day + "°F");
                    dayEl.append(dayTemp);

                    var dayHumid = $("<p>");
                    dayHumid.text("Humidity: " + data.daily[index].humidity + "%");
                    dayEl.append(dayHumid);
                }

            })
    }   

    $(".clearBtn").click(function(){
        localStorage.clear();
        window.location.reload();

    });

})
