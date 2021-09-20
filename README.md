# Weather Dashboard

## Search

When the user enters a city name into the search bar and clicks search it displays current and forecasted weather. 

On the back end when the search button is pressed `searchCityWeather()` function is called. This inputs the city name into the Open Weather API and weather data is fetched for that city.

Fetch:

```javascript
...
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
...
```

## Current Weather

Current weather is presented in a container showing City name, Date, Weather Icon. Then below that the weather data is shown.
<br>
<br>
![Screen Shot 2021-09-19 at 7 28 47 PM](https://user-images.githubusercontent.com/85598391/133947987-2686a829-e4bf-4075-a7e4-1e2e411a7d0f.png)

Weather Icon is pulled from Openweathermap.org

```javascript
   let imageIcon = current.weather[0].icon;
   let imageIconEl = $('<img class="col-sm-1">').attr('src', `http://openweathermap.org/img/wn/${imageIcon}.png`);
```


## UV Index

UV index background is green, yellow or red depending on the UV index value.

```javascript
    //gives favorable, moderate or severe coloring to index number depending on value
    if(uvIndex < 2){
        uvIndexVal.addClass("btn-success");
    }else if (uvIndex < 7) {
        uvIndexVal.addClass("btn-warning");
    }else {
        uvIndexVal.addClass("btn-danger");
    }
```

## Future Weather Condtions

5 day forcast is created in a loop and contents are filled similar to the current weather.
<br>
<br>
![Screen Shot 2021-09-19 at 7 38 11 PM](https://user-images.githubusercontent.com/85598391/133948265-603e13b4-a857-4e56-a5e1-815af831317a.png)


## Search History

`localStorage` is utilized to hold search history. Whenever the user searches a city, all the previous searches move down and the latest search goes to top of the screen.

![Screen Shot 2021-09-19 at 7 52 34 PM](https://user-images.githubusercontent.com/85598391/133948687-f1f6bee8-de0f-4a0f-8e94-5972ec6a51b5.png) ![Screen Shot 2021-09-19 at 7 53 13 PM](https://user-images.githubusercontent.com/85598391/133948708-3a971b6e-073a-4ae3-aa23-e8a9037153ae.png)
