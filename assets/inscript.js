const apiKey = '72b5ee0a108bae1bff1d403495a8b843';
const form = document.getElementById('city-name');
const input = document.getElementById('cityname');
const weatherInfo = document.querySelector('.weather-info');
const forecastDaysContainer = document.querySelector('.forecast-days');
const searchHistoryContainer = document.createElement('div'); // Container for search history
document.body.appendChild(searchHistoryContainer); // Append search history container to the body

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = input.value.trim();
    if (city) {
        fetchWeatherData(city);
        addToSearchHistory(city);
    }
});

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
            localStorage.setItem('currentWeather', JSON.stringify(data));

            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(forecastData => {
                    updateWeatherForecast(forecastData);
                    localStorage.setItem('weatherForecast', JSON.stringify(forecastData));
                })
                .catch(error => console.error('Error fetching weather forecast data:', error));
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherInfo(data) {
    const cityDisplay = document.querySelector('.cityDisplay');
    const temp = document.querySelector('.temp');
    const humi = document.querySelector('.humi');
    const wind = document.querySelector('.wind');
    const weatherIconElement = document.querySelector('.weather-icon');

    cityDisplay.textContent = data.name;
    temp.textContent = `Temperature: ${data.main.temp}°F`;
    humi.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind Speed: ${data.wind.speed} mph`;

    const iconCode = data.weather[0].icon;
    weatherIconElement.className = 'weather-icon fas ' + getWeatherIconClass(iconCode);

    weatherInfo.style.display = 'block';
}

function getWeatherIconClass(iconCode) {
    const iconMap = {
        '01d': 'fa-sun',
        '01n': 'fa-moon',
        '02d': 'fa-cloud-sun',
        '02n': 'fa-cloud-sun',
        '03d': 'fa-cloud',
        '03n': 'fa-cloud',
        '04d': 'fa-cloud',
        '04n': 'fa-cloud',
        '09d': 'fa-cloud-showers-heavy',
        '09n': 'fa-cloud-showers-heavy',
        '10d': 'fa-cloud-sun-rain',
        '10n': 'fa-cloud-sun-rain',
        '11d': 'fa-bolt',
        '11n': 'fa-bolt',
        '13d': 'fa-snowflake',
        '13n': 'fa-snowflake',
        '50d': 'fa-smog',
        '50n': 'fa-smog'
    };
    return iconMap[iconCode] || 'fa-question-circle';
}

function updateWeatherForecast(data) {
    forecastDaysContainer.innerHTML = ''; // Clear the existing content

    const uniqueDays = [];
    data.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000);
        const dateString = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

        if (!uniqueDays.includes(dateString) && uniqueDays.length < 5) {
            uniqueDays.push(dateString);

            const dayBox = document.createElement('div');
            dayBox.classList.add('day-box');

            const dayNameElement = document.createElement('h2');
            dayNameElement.textContent = dateString;

            const weatherElement = document.createElement('p');
            weatherElement.textContent = `Weather: ${forecast.weather[0].description}`;

            const temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${forecast.main.temp}°F`;

            const windElement = document.createElement('p');
            windElement.textContent = `Wind: ${forecast.wind.speed} mph`;

            const humidityElement = document.createElement('p');
            humidityElement.textContent = `Humidity: ${forecast.main.humidity}%`;

            const weatherIconElement = document.createElement('i');
            weatherIconElement.classList.add('fas');
            weatherIconElement.classList.add(getWeatherIconClass(forecast.weather[0].icon));

            dayBox.append(dayNameElement, weatherIconElement, weatherElement, temperatureElement, windElement, humidityElement);
            forecastDaysContainer.appendChild(dayBox);
        }
    });

    forecastDaysContainer.style.display = 'flex';
}

function addToSearchHistory(city) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryContainer.innerHTML = '';
    searchHistory.forEach(city => {
        const cityElement = document.createElement('button');
        cityElement.textContent = city;
        cityElement.classList.add('btn', 'btn-secondary', 'm-2');
        cityElement.addEventListener('click', () => fetchWeatherData(city));
        searchHistoryContainer.appendChild(cityElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displaySearchHistory();
    const currentWeather = JSON.parse(localStorage.getItem('currentWeather'));
    const weatherForecast = JSON.parse(localStorage.getItem('weatherForecast'));
    if (currentWeather) updateWeatherInfo(currentWeather);
    if (weatherForecast) updateWeatherForecast(weatherForecast);
});
