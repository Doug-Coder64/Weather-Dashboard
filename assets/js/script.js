const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

function displayCurrent(current, city) {

    let todayEl = $('#today');
    todayEl.addClass('border border-dark rounded-1')

    let date = new Date(current.dt * 1000);

    //Empty Current Day element
    todayEl.empty();

    //create header for city name, date and weather Icon
    let cityHeader = $('<div>').addClass('row');

    //city name and date
    let cityName = $('<h2 id="cityName">').addClass("col-auto h2 m-2");
    cityName.text(`${city} (${date.getMonth()}/${date.getDate()}/${date.getFullYear()})`);
    
    //Pull Weather Icon From API, inject it in URL to display on screen
    let imageIcon = current.weather[0].icon;
    let imageIconEl = $('<img class="col-sm-1">').attr('src', `http://openweathermap.org/img/wn/${imageIcon}.png`);

    //Pull Temperature from API and apply it to element
    let temp = current.temp;
    let tempEl = $('<div class="m-2">').text(`Temp: ${temp}°`);

    //Pull Wind Speed from API and Apply it to element
    let wind = current.wind_speed;
    let windEl = $('<div class="m-2">').text(`Wind: ${wind}MPH`);

    //Pull Humidity from API and Apply it to element
    let humidity = current.humidity;
    let humidityEl = $('<div class="m-2">').text(`Humidity ${humidity}%`);

    let uvIndex = current.uvi;
    let uvIndexContainer = $('<div class="row">');
    let uvIndexEl = $(`<div class="col-auto m-2">`).text(`UV Index:`);
    let uvIndexVal = $('<div class="col-auto m-2 rounded-1">').text(uvIndex);
    
    //gives favorable, moderate or severe coloring to index number depending on value
    if(uvIndex < 2){
        uvIndexVal.addClass("btn-success");
    }else if (uvIndex < 7) {
        uvIndexVal.addClass("btn-warning");
    }else {
        uvIndexVal.addClass("btn-danger");
    }
    
    cityHeader.append(cityName, imageIconEl);
    uvIndexContainer.append(uvIndexEl, uvIndexVal);
    todayEl.append(cityHeader, tempEl, windEl, humidityEl, uvIndexContainer);
}

function displayFiveDay(daily) {
    
    let forecastEl = $('#forecast');
    
    //Empty Current Day element
    forecastEl.empty();
    forecastEl.addClass("container");
    
    //city name and date
    let fiveHeader = $('<h2 id="fiveHeader">').addClass("h2");
    fiveHeader.text(`5-Day Forecast:`);
    
    forecastEl.append(fiveHeader);

    let fiveForecast = $('<div class="row justify-content-between">');
    for (let i = 0; i < 5; i++) {
        let date = new Date(daily[i].dt * 1000);

        let dateEl = $('<h5 id="cityName">').addClass("col-auto h5 m-2");
        dateEl.text(`${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`);
        
        let imageIcon = daily[i].weather[0].icon;
        let imageIconEl = $('<img>').attr('src', `http://openweathermap.org/img/wn/${imageIcon}.png`);

        //Pull Temperature from API and apply it to element
        let temp = daily[i].temp.day;
        let tempEl = $('<div class="m-2">').text(`Temp: ${temp}°`);

        //Pull Wind Speed from API and Apply it to element
        let wind = daily[i].wind_speed;
        let windEl = $('<div class="m-2">').text(`Wind: ${wind}MPH`);

        //Pull Humidity from API and Apply it to element
        let humidity = daily[i].humidity;
        let humidityEl = $('<div class="m-2">').text(`Humidity ${humidity}%`);

        let dailyForecast = $(`<div class="col-2 bg-secondary rounded-1">`);

        dailyForecast.append(dateEl, imageIconEl, tempEl, windEl, humidityEl);
    
        fiveForecast.append(dailyForecast);
    }

    forecastEl.append(fiveForecast);
}

function saveToLocalState(city) {
    const maxSearch = 10;

    if(city){
        for (let i = 0; i < maxSearch; i++) {
                let x = maxSearch - 1 - i;
                localStorage.setItem(`${x}`, localStorage.getItem(`${x-1}`));
        }
        localStorage.setItem(`0`, city);
    }

    let list = $('#history');
    list.empty();

    for(let i = 0; i < maxSearch; i++) {
        if(localStorage.getItem(`${i}`) != "null") {
            let cityEl  = $(`<li id="search-${i}">`).addClass("list-group-item");
            cityEl.click(function(){
                $(`#searchTerm`).val($(`#search-${i}`).text());
                searchCityWeather();
            })
            cityEl.text(localStorage.getItem(`${i}`)); 
            list.append(cityEl);
        }
    }
}

function searchCityWeather() {

    //sets city from search term
    const city = document.querySelector('#searchTerm').value;

    //using fetch pulls weather information for selected city from openWeatherMap.org
    fetch(`${weatherApiRootUrl}/geo/1.0/direct?q=${city}&limit=5&appid=${weatherApiKey}`)
    .then(function (res) {
        return res.json();
    })
    .then(function (body) {
        console.log('body', body);
        const lat = body[0].lat;
        const lon = body[0].lon;
        console.log(lat, lon);
        return fetch(`${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`)
    })
    .then(function (res) {
        return res.json();
    })
    .then(function (body) {
        console.log(body)
        const current = body.current;
        const daily = body.daily;
        displayCurrent(current, city);
        displayFiveDay(daily);
        saveToLocalState(city);
    })
    .catch(function (error) {
     console.log(error)
    });
}

saveToLocalState();