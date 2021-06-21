$(document).ready(function () {
    var currentDay = moment().format("dddd, MMMM Do YYYY");
    $("#currentDay").append(currentDay);

    var cityInputEl = $("#cityInput");
    var cityListEl = $(".cityList");
    var cityHeaderEl = $(".cityHeader");
    var currentDisplay = $(".currentInfo");
    var currentList = $(".currentList");
    var day1 = $(".day1");
    var day2 = $(".day2");
    var day3 = $(".day3");
    var day4 = $(".day4");
    var day5 = $(".day5");
    const style = document.createElement('style');

    style.innerHTML = `
    .high {
        color: white;
        background-color: red;
    }
   
    .med {
        color: white;
        background-color: orange;
    }
    
    .low {
        color: white;
        background-color: yellow;
    }`;

    function displayCitiesList() {
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

    $("#searchBtn").on("click", function (event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentList.empty();
        currentDisplay.empty();

        day1.empty();
        day2.empty();
        day3.empty();
        day4.empty();
        day5.empty();

        // get value of search box and set it to the variable "cityName"
        var cityInput = $(this).siblings("#cityInput").val();
        var cityName = cityInput.toLowerCase();

        function saveCities(citySaved) {

            var prevCities = JSON.parse(localStorage.getItem("cities")) || [];

            var newCities = JSON.stringify(prevCities);
            localStorage.setItem("cities", newCities);

            var newCityListItem = $("<li>");
            newCityListItem.text(citySaved.charAt(0) + citySaved.slice(1))

            newCityListItem.addClass("list-group-item");
            newCityListItem.addClass("cityClick");
            cityListEl.append(newCityListItem);


        }

        saveCities(cityName);
        getData(cityName);

        cityInputEl.val("");
    })

    $(document).on("click", ".cityClick", function (event) {
        event.preventDefault();

        cityHeaderEl.empty();
        currentList.empty();
        currentDisplay.empty();

        day1.empty();
        day2.empty();
        day3.empty();
        day4.empty();
        day5.empty();

        var cityClickName = $(this).text();
        console.log(this);
        console.log(cityClickName);
        getData(cityClickName);

    })

    function getData(cityChoice) {

        let apiKey = "9bd0e1b11f3879904bad098830aa5bb2";
        var currentWeatherLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityChoice + "&units=imperial&appid=" + apiKey;

        fetch(currentWeatherLink)

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {
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

            .then(function (response) {
                return response.json();
            })

            .then(function (data) {

                var weatherDescription = $("<li>");
                weatherDescription.text("Current Weather: " + data.current.weather[0].description);
                weatherDescription.addClass("list-group-item");
                currentDisplay.append(weatherDescription);


                var weatherTemp = $("<li>");
                weatherTemp.text("Temperature: " + data.current.temp + "°F");
                weatherTemp.addClass("list-group-item");
                currentDisplay.append(weatherTemp);


                var weatherHumid = $("<li>");
                weatherHumid.text("Humidity: " + data.current.humidity + "%");
                weatherHumid.addClass("list-group-item");
                currentDisplay.append(weatherHumid);


                var WindSpeed = $("<li>");
                WindSpeed.text("Wind Speed: " + data.current.wind_speed + "mph");
                WindSpeed.addClass("list-group-item");
                currentDisplay.append(WindSpeed);

                //UV Index
                var UvIndex = $("<li>");
                var rawUvIndex = $("<span>")

                rawUvIndex.text(data.current.uvi);
                rawUvIndex.addClass("badge");
                UvIndex.text("UV Index: ");
                UvIndex.addClass("list-group-item");

                var intUvIndex = parseInt(data.value);

                if (intUvIndex >= 7) {
                    rawUvIndex.addClass("high");
                    document.head.appendChild(style);

                } else if (intUvIndex < 6 && intUvIndex >= 4) {
                    rawUvIndex.addClass("med");
                    document.head.appendChild(style);

                } else {
                    rawUvIndex.addClass("low");
                    document.head.appendChild(style);
                }

                UvIndex.append(rawUvIndex);
                currentDisplay.append(UvIndex);

                forecast(1, day1);
                forecast(2, day2);
                forecast(3, day3);
                forecast(4, day4);
                forecast(5, day5);

                function forecast(dayNum, day) {
                    var index = parseInt(dayNum)

                    var dayDate = $("<p>");
                    dayDate.text(moment.unix(data.daily[index].dt).format('ddd'));
                    day.append(dayDate);

                    var dayIcon = $("<img>");
                    var iconcode = data.daily[index].weather[0].icon;
                    dayIcon.attr("src", "http://openweathermap.org/img/w/" + iconcode + ".png");
                    day.append(dayIcon);

                    var dayTemp = $("<p>");
                    dayTemp.text("Temp: " + data.daily[index].temp.day + "°F");
                    day.append(dayTemp);

                    var dayHumid = $("<p>");
                    dayHumid.text("Humidity: " + data.daily[index].humidity + "%");
                    day.append(dayHumid);
                }
            })
    }

    $(".clearBtn").click(function () {
        localStorage.clear();
        window.location.reload();

    });

})
