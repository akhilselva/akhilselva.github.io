var myImg = document.querySelector("#weather_icon");
var myHeading = document.querySelector('#weather_head');
var location;
var description = document.querySelector("#description");
var info = document.querySelector("#info");
var degrees = "\u00b0";


function setLocation(prevLocation, geoLocationFaliure) {
    if (!geoLocationFaliure) { myLocation = prompt("Please enter city name") } else { myLocation = prompt("Fetching geolocation failed! Please enter location manually.") }
    if (myLocation === "") {
        setLocation();
    } else if (myLocation === null) {
        myLocation = prevLocation;
    }
    localStorage.setItem('location', myLocation)
    setPage(myLocation);
}

if (!(localStorage.getItem('location'))) {
    getLoc();
} else {
    myLocation = localStorage.getItem('location')
    setPage(myLocation);
}

function setPage(myLocation, isGeo, latitude, longitude) {
    if (isGeo) {
        link = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=metric&appid=499093abb9ae71e744766738f864d7d6";
    } else {
        link = "https://api.openweathermap.org/data/2.5/weather?q=" + myLocation + "&units=metric&apikey=" + '499093abb9ae71e744766738f864d7d6';
    }

    fetch(link)
        .then((response) => {
            if (response.status == 404) {
                if (confirm("City not found! Use geolocation?")) {
                    getLoc();
                } else {
                    
                }
                
            }
            return response.json();
        })
        .then((myJson) => {
            localStorage.setItem('location', myJson.name)
            document.querySelector("#weather_title").textContent = `Weather in ${myJson.name}`
            document.querySelector("#weather_head").textContent = `${myJson.name}`
            myImg.setAttribute('src', `https://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`);
            description.textContent = `${myJson.main.temp}${degrees}C, ${myJson.weather[0].main}`
            info.innerHTML = (`Feels like ${myJson.main.feels_like}${degrees}C<br>
                            Minimum ${myJson.main.temp_min}${degrees}C, Maximum ${myJson.main.temp_max}${degrees}C<br>
                            <hr color="white">
                            Wind: ${myJson.wind.speed}m/s,${myJson.wind.deg}${degrees}<br>
                            Clouds: ${myJson.clouds.all}%<br>
                            Pressure: ${myJson.main.pressure}hPa<br>
                            Humidity: ${myJson.main.humidity}%<br>
                            Visibility: ${checkPresence(myJson.visibility, "km")}<br>`)
        });
}

function checkPresence(value, symbol) {
    if (value === undefined) {
        return (`(data unavailable)`)
    } else {
        return (`${value / 1000}${symbol}`)
    }
}

//Geolocation API
function getLoc() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;
    setPage(undefined, true, crd.latitude, crd.longitude)
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    setLocation(localStorage.getItem('location'), true);
}