const weatherApiRootUrl = 'https://api.openweathermap.org';
const weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9';

function displayCurrent(current) {
    
}

function displayFiveDay(daily) {

}

function saveToLocalState(city) {
    

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
        displayCurrent(current);
        displayFiveDay(daily);
        saveToLocalState(city);
    })
    .catch(function (error) {
     console.log(error)
    });
}