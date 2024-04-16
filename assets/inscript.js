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

            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(forecastData => {
                updateWeatherForecast(forecastData);
            })
            .catch(error => {
                console.error('Error fetching weather forecast data:', error);
            });
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
    const weatherIconElement = document.querySelector('.weather-icon');

    cityDisplay.textContent = data.name;
    temp.textContent = `Temperature: ${data.main.temp}°F`;
    humi.textContent = `Humidity: ${data.main.humidity}%`;

    // Check if wind data is available
    if (data.wind) {
        wind.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    } else {
        wind.textContent = 'Wind Speed: N/A';
    }

    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIconElement.className = 'weather-icon';
    weatherIconElement.classList.add(getWeatherIconClass(iconCode));
}

function getWeatherIconClass(iconCode) {
    // Map icon codes to appropriate weather icon class  #was a nightmare
    switch (iconCode) {
        case '01d':
            return 'fa-sun';
        case '01n':
            return 'fa-moon';
        case '02d':
        case '02n':
            return 'fa-cloud-sun';
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            return 'fa-cloud';
        case '09d':
        case '09n':
            return 'fa-cloud-showers-heavy';
        case '10d':
        case '10n':
            return 'fa-cloud-sun-rain';
        case '11d':
        case '11n':
            return 'fa-bolt';
        case '13d':
        case '13n':
            return 'fa-snowflake';
        case '50d':
        case '50n':
            return 'fa-smog';
        default:
            return 'fa-question-circle';
    }
}

function updateWeatherForecast(data) {
    const forecastDaysContainer = document.querySelector('.forecast-days');
    forecastDaysContainer.innerHTML = ''; // Clear the existing content

    if (data.list) {
        console.log(data.list)

        for(let i=0; i < data.list.length; i=i+7) {
            const forecast = data.list[i];
            const forecastDate = new Date(forecast.dt * 1000); // Convert timestamp to date
            console.log('here is forecaseDate: ', forecastDate) // Convert timestamp to date
            
            // Create a day-box element for each forecast day
            const dayBox = document.createElement('div');
            dayBox.classList.add('day-box');

            // Create and populate HTML elements
            const dayNameElement = document.createElement('h2');
            dayNameElement.textContent = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });

            const weatherElement = document.createElement('p');
            weatherElement.textContent = `Weather: ${forecast.weather[0].description}`;

            const temperatureElement = document.createElement('p');
            temperatureElement.textContent = `Temperature: ${forecast.main.temp}°F`;

             // Create and add weather icon element

            const weatherIconElement = document.createElement('i');
            weatherIconElement.classList.add('fas');
            weatherIconElement.classList.add(getWeatherIconClass(forecast.weather[0].icon));

            // Append weather data elements to day-box
            dayBox.appendChild(dayNameElement);
            dayBox.appendChild(weatherIconElement);
            dayBox.appendChild(weatherElement);
            dayBox.appendChild(temperatureElement);

            // Append the day-box to the forecast days container
            forecastDaysContainer.appendChild(dayBox);
        };

        // Display the weather forecast container
        forecastDaysContainer.style.display = 'flex';
    } else {
        console.error('Error: Data format for forecast is incorrect.');
    }
}
