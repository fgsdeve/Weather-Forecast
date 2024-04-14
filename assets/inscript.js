/* WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city*/

const apiKey = '72b5ee0a108bae1bff1d403495a8b843';

const form = document.getElementById('city-name');
const input = document.getElementById('cityname');
const weatherInfo = document.querySelector('.weather-info');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const city = input.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
});



function updateWeatherInfo(data) {
    const cityDisplay = document.querySelector('.cityDisplay');
    const temp = document.querySelector('.temp');
    const humi = document.querySelector('.humi');
    const wind = document.querySelector('.wind');
    const rain = document.querySelector('.rain');
    const storm = document.querySelector('.storm');
    const snow = document.querySelector('.snow');

    cityDisplay.textContent = data.name;
    temp.textContent = `Temperature: ${data.main.temp}°F`;
    humi.textContent = `Humidity: ${data.main.humidity}%`;

    // Check if wind data is available
    if (data.wind) {
        wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    } else {
        wind.textContent = 'Wind Speed: N/A';
    }

    // Check if rain data is available
    if (data.rain) {
        rain.textContent = `Rain Volume: ${data.rain['1h']} mm`;
    } else {
        rain.textContent = 'Rain Volume: N/A';
    }

    // Check if storm data is available
    if (data.weather[0].main === 'Thunderstorm') {
        storm.textContent = 'Storm Conditions: Thunderstorm';
    } else {
        storm.textContent = 'Storm Conditions: None';
    }

    // Check if snow data is available
    if (data.snow) {
        snow.textContent = `Snow Volume: ${data.snow['1h']} mm`;
    } else {
        snow.textContent = 'Snow Volume: N/A';
    }

    function updateWeatherForecast(data) {
        weatherInfo.innerHTML = '';
    
        for (let i = 0; i < data.list.length; i++) {
            const forecast = data.list[i];
            const forecastDate = new Date(forecast.dt * 1000); // Convert timestamp to date
    
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
    
            const dateElement = document.createElement('p');
            dateElement.textContent = forecastDate.toDateString();
    
            const temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${forecast.main.temp}°F`;
    
            const humidityElement = document.createElement('p');
            humidityElement.textContent = `Humidity: ${forecast.main.humidity}%`;
    
            forecastItem.appendChild(dateElement);
            forecastItem.appendChild(temperatureElement);
            forecastItem.appendChild(humidityElement);
    
            weatherInfo.appendChild(forecastItem);
        }

    weatherInfo.style.display = 'block'; // Show the weather information
}

}