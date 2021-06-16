var cities = [];
var searchBarEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var currentWeatherEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var fiveDayEL = document.querySelector("#fiveday-container");
var pastSearchesEl = document.querySelector("#past-search-list");

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } 
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    let apiKey = "9bd0e1b11f3879904bad098830aa5bb2";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){
   currentWeatherEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;

   console.log(weather);

   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("d MMMM, YYYY") + ") ";   

   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);   

   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °C";
   temperatureEl.classList = "list-group-item"
  
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   citySearchInputEl.appendChild(currentDate);
   citySearchInputEl.appendChild(weatherIcon);
   currentWeatherEl.appendChild(temperatureEl);
   currentWeatherEl.appendChild(humidityEl);
   currentWeatherEl.appendChild(windSpeedEl);
}

var get5Day = function(city){
    let apiKey = "9bd0e1b11f3879904bad098830aa5bb2"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    fiveDayEL.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";
 
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("dddd, D MMM");
       forecastDate.classList = "card-header text-center"            
     
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °C";        

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

      forecastEl.appendChild(forecastDate); 
      forecastEl.appendChild(weatherIcon);
      forecastEl.appendChild(forecastTempEl);
      forecastEl.appendChild(forecastHumEl);
      fiveDayEL.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchesEl.prepend(pastSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

searchBarEl.addEventListener("submit", formSumbitHandler);
pastSearchesEl.addEventListener("click", pastSearchHandler);
