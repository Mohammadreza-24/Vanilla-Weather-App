let dateTime = document.querySelector("#time");
let currentDate = new Date();
function formatDate(date) {
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let month = date.getMonth();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let formattedMonth = months[month];
  return `${formattedMonth} ${day}, ${hours}:${minutes}`;
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let description = document.querySelector("#description");
  let precipitationElement = document.querySelector("#precipitation");
  let humidityElement = document.querySelector("#humidity");
  let wind = document.querySelector("#wind-speed");
  let iconElement = document.querySelector("#icon");
  let tempCelsius = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(tempCelsius);
  updateTemperatureUnit(tempCelsius);
  cityElement.innerHTML = response.data.name;
  description.innerHTML = response.data.weather[0].description;
  precipitationElement.innerHTML = response.data.clouds.all;
  humidityElement.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  dateTime.innerHTML = formatDate(currentDate);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "f48be877d847b465b9d3fc1a539f1bd7";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° /</span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSubmit);
searchCity("Berlin");

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

function updateTemperatureUnit(tempCelsius) {
  let temperatureElement = document.querySelector("#temperature");
  let currentTemp = parseFloat(temperatureElement.innerHTML);
  let isCelsius = temperatureElement.innerHTML.includes("°C");

  if (isCelsius) {
    let tempFahrenheit = celsiusToFahrenheit(tempCelsius);
    temperatureElement.innerHTML = `${Math.round(tempFahrenheit)}°F`;
  } else {
    temperatureElement.innerHTML = `${Math.round(tempCelsius)}°C`;
  }
}

document.querySelector("#clink").addEventListener("click", function (event) {
  let temperatureElement = document.querySelector("#temperature");
  let currentTemp = parseFloat(temperatureElement.innerHTML);
  let isCelsius = temperatureElement.innerHTML.includes("°C");

  if (!isCelsius) {
    let tempCelsius = fahrenheitToCelsius(currentTemp);
    temperatureElement.innerHTML = `${Math.round(tempCelsius)}°C`;
  }
});

document.querySelector("#flink").addEventListener("click", function (event) {
  let temperatureElement = document.querySelector("#temperature");
  let currentTemp = parseFloat(temperatureElement.innerHTML);
  let isCelsius = temperatureElement.innerHTML.includes("°C");

  if (isCelsius) {
    let tempFahrenheit = celsiusToFahrenheit(currentTemp);
    temperatureElement.innerHTML = `${Math.round(tempFahrenheit)}°F`;
  }
});
