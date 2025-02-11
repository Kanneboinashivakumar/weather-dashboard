const apiKey = "43d340422e7d619d621646f71c7e7d5a";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const locationButton = document.querySelector(".location-btn");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.querySelector(".error");
const darkModeToggle = document.getElementById("dark-mode-toggle");
// Auto-suggests cityname
searchInput.addEventListener("input", function () {
    fetch(`https://api.teleport.org/api/cities/?search=${searchInput.value}`)
        .then(response => response.json())
        .then(data => {
            console.log("Suggestions:", data);
        });
});
//fetchs weather data
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error:", error);
        errorMessage.innerText = "City not found!";
        errorMessage.style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

function updateWeatherUI(data) {
    document.querySelector(".weather").style.display = "block";
    errorMessage.style.display = "none";

    document.querySelector(".cityName").innerText = data.name;
    document.querySelector(".country").innerText = data.sys.country;
    document.querySelector(".temp").innerText = `${Math.round(data.main.temp)}°C`;
    document.querySelector(".humidity").innerText = `${data.main.humidity}%`;
    document.querySelector(".wind").innerText = `${(data.wind.speed * 3.6).toFixed(2)} km/h`;

    document.querySelector(".visibility").innerText = `Visibility: ${data.visibility / 1000} km`;
    document.querySelector(".sunrise").innerText = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    document.querySelector(".sunset").innerText = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
}

// Gives user location by fetching weather
locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`);
                const data = await response.json();

                if (data.cod !== 200) {
                    throw new Error(data.message);
                }

                updateWeatherUI(data);
            } catch (error) {
                console.error("Error fetching location weather:", error);
                errorMessage.innerText = "Unable to fetch location weather!";
                errorMessage.style.display = "block";
            }
        }, () => {
            errorMessage.innerText = "Location access denied!";
            errorMessage.style.display = "block";
        });
    } else {
        errorMessage.innerText = "Geolocation is not supported!";
        errorMessage.style.display = "block";
    }
});

function updateDarkModeUI() {
    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.innerText = "☀️"; // Light mode icon
    } else {
        darkModeToggle.innerText = "🌙"; // Dark mode icon
    }
}

if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    updateDarkModeUI();
}

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }

    updateDarkModeUI();
});

searchButton.addEventListener("click", () => checkWeather(searchInput.value.trim()));
