// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // IMPORTANT: Replace 'YOUR_API_KEY_HERE' with your actual OpenWeatherMap API key
    // Get your free API key from: https://openweathermap.org/api
    API_KEY: 'edcc1efafa2fcdbdf91c64f013bc7365',
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ICON_URL: 'https://openweathermap.org/img/wn',
    DEFAULT_CITY: 'Mumbai',
    UNITS: 'metric' // metric for Celsius, imperial for Fahrenheit
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    currentWeather: document.getElementById('currentWeather'),
    forecastSection: document.getElementById('forecastSection'),
    
    // Current weather elements
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    weatherIcon: document.getElementById('weatherIcon'),
    currentTemp: document.getElementById('currentTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    feelsLike: document.getElementById('feelsLike'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    
    // Forecast elements
    forecastContainer: document.getElementById('forecastContainer'),
    
    // City tags
    cityTags: document.querySelectorAll('.city-tag')
};

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if API key is configured
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your OpenWeatherMap API key in app.js to use this application. Get your free key at: https://openweathermap.org/api');
        return;
    }
    
    // Load default city on page load
    fetchWeatherByCity(CONFIG.DEFAULT_CITY);
});

// Search button click
elements.searchBtn.addEventListener('click', handleSearch);

// Enter key in search input
elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Location button click
elements.locationBtn.addEventListener('click', handleGeolocation);

// Popular city tags
elements.cityTags.forEach(tag => {
    tag.addEventListener('click', () => {
        const city = tag.getAttribute('data-city');
        elements.cityInput.value = city;
        fetchWeatherByCity(city);
    });
});

// ============================================
// HANDLER FUNCTIONS
// ============================================
function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError('Please enter a city name');
    }
}

function handleGeolocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                hideLoading();
                showError('Unable to retrieve your location. Please enter a city manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser');
    }
}

// ============================================
// API FUNCTIONS
// ============================================
async function fetchWeatherByCity(city) {
    showLoading();
    hideError();
    
    try {
        // Fetch current weather
        const currentUrl = `${CONFIG.BASE_URL}/weather?q=${city},IN&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
            throw new Error(currentResponse.status === 404 ? 'City not found' : 'Failed to fetch weather data');
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast
        const forecastUrl = `${CONFIG.BASE_URL}/forecast?q=${city},IN&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Display data
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error fetching weather:', error);
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        // Fetch current weather
        const currentUrl = `${CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast
        const forecastUrl = `${CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.UNITS}`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Display data
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        showError(error.message);
        console.error('Error fetching weather:', error);
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function displayCurrentWeather(data) {
    // Update city name and date/time
    elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    elements.dateTime.textContent = formatDateTime(new Date());
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `${CONFIG.ICON_URL}/${iconCode}@2x.png`;
    elements.weatherIcon.alt = data.weather[0].description;
    
    // Update temperature
    elements.currentTemp.textContent = Math.round(data.main.temp);
    elements.feelsLike.textContent = Math.round(data.main.feels_like);
    
    // Update weather description
    elements.weatherDesc.textContent = data.weather[0].description;
    
    // Update stats
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`; // Convert m/s to km/h
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    
    // Show current weather section
    elements.currentWeather.classList.remove('hidden');
}

function displayForecast(data) {
    // Clear previous forecast
    elements.forecastContainer.innerHTML = '';
    
    // Get one forecast per day (at 12:00 PM when available)
    const dailyForecasts = getDailyForecasts(data.list);
    
    dailyForecasts.forEach(forecast => {
        const card = createForecastCard(forecast);
        elements.forecastContainer.appendChild(card);
    });
    
    // Show forecast section
    elements.forecastSection.classList.remove('hidden');
}

function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    const iconCode = forecast.weather[0].icon;
    const temp = Math.round(forecast.main.temp);
    const description = forecast.weather[0].description;
    
    card.innerHTML = `
        <div class="forecast-date">${dayName}, ${dateStr}</div>
        <img src="${CONFIG.ICON_URL}/${iconCode}@2x.png" alt="${description}" class="forecast-icon">
        <div class="forecast-temp">${temp}°C</div>
        <div class="forecast-desc">${description}</div>
    `;
    
    return card;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getDailyForecasts(forecastList) {
    const dailyData = [];
    const processedDates = new Set();
    
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        // Skip if we already have a forecast for this day
        if (processedDates.has(dateStr)) {
            return;
        }
        
        // Prefer forecasts around noon (12:00)
        const hour = date.getHours();
        if (hour >= 11 && hour <= 14) {
            dailyData.push(item);
            processedDates.add(dateStr);
        } else if (!processedDates.has(dateStr) && dailyData.length < 5) {
            // If no noon forecast available, take the first one for that day
            dailyData.push(item);
            processedDates.add(dateStr);
        }
    });
    
    // Return only 5 days
    return dailyData.slice(0, 5);
}

function formatDateTime(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    };
    
    return date.toLocaleString('en-IN', options);
}

function showLoading() {
    elements.loadingSpinner.classList.remove('hidden');
    elements.currentWeather.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
}

function hideLoading() {
    elements.loadingSpinner.classList.add('hidden');
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.currentWeather.classList.add('hidden');
    elements.forecastSection.classList.add('hidden');
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}
