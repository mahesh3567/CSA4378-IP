// Event listener to trigger button click on 'Enter' key press
const inputField = document.getElementById("city-input");
const button = document.querySelector("button");

inputField.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault(); // prevent form submission
        button.click(); // simulate button click
    }
});

// Replace this with your own API key from OpenWeatherMap
const apiKey = "99080ea055cb1204c4bcfbf544ec0bfe";  // Sign up at OpenWeatherMap to get an API Key

// Function to fetch weather data from OpenWeatherMap API
async function getWeather() {
    const city = document.getElementById("city-input").value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    const weatherInfoDiv = document.getElementById("weather-info");
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Log the entire response for debugging
        console.log(data);

        // Handle the case if city is not found
        if (data.cod !== "200") {
            alert("City not found! Error code: " + data.cod + ", " + data.message);
            return;
        }

        // Extract weather data for the next 3 days (assuming 3-day forecast)
        const cityName = data.city.name;
        const forecastDays = get3DayForecast(data.list);

        // Display weather data on the page
        weatherInfoDiv.style.display = "block";
        weatherInfoDiv.innerHTML = `
            <h2>Weather in ${cityName}</h2>
            ${forecastDays.map(day => `
                <div class="forecast-day">
                    <h3>${day.date}</h3>
                    <img src="${day.icon}" alt="Weather icon" />
                    <p><strong>Temperature:</strong> ${day.temp}°C</p>
                    <p><strong>Description:</strong> ${day.description}</p>
                </div>
            `).join('')}
        `;
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        alert("Something went wrong, please try again.");
    }
}

// Function to process the 5-day forecast and get data for the next 3 days
function get3DayForecast(forecastList) {
    // We'll group data by day and take the first data point for each day
    const forecastDays = [];
    let currentDay = null;

    // Loop through the forecast list
    for (let i = 0; i < forecastList.length; i++) {
        const forecast = forecastList[i];

        // Convert timestamp to a Date object
        const forecastDate = new Date(forecast.dt * 1000);
        const forecastDay = forecastDate.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format

        // Only take one data point per day (the first one in the list for that day)
        if (currentDay !== forecastDay) {
            currentDay = forecastDay;

            forecastDays.push({
                date: forecastDate.toLocaleDateString(), // Format the date
                temp: forecast.main.temp, // Temperature in Celsius
                description: forecast.weather[0].description, // Weather description
                icon: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`, // Weather icon URL
            });

            // Stop after collecting 3 days of data
            if (forecastDays.length === 3) {
                break;
            }
        }
    }

    return forecastDays;
}
