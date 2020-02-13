var myImg = document.querySelector("img");
var myHeading = document.querySelector('h1');
var location;
var description=document.querySelector("#description");
var info=document.querySelector("#info");
var degrees="\u00b0";
console.log("Hey there!")
function setLocation(prevLocation) {
    myLocation = prompt("Please enter city name")
    if (myLocation === "") {
        setLocation();
    }else if (myLocation === null) {
        myLocation=prevLocation;
    }
    localStorage.setItem('location', myLocation)
    setPage(myLocation);
}

if (!(localStorage.getItem('location'))) {
    setLocation();
    //setPage();
} else {
    myLocation = localStorage.getItem('location')
    setPage(myLocation);
}

function setPage(myLocation) {
    link = "https://api.openweathermap.org/data/2.5/weather?q=" + myLocation + "&units=metric&apikey=" + '499093abb9ae71e744766738f864d7d6';
    fetch(link)
        .then((response) => {
            if (response.status==404) {
                alert("City not found!")
                setLocation(myLocation);
            }
            return response.json();
        })
        .then((myJson) => {
            document.querySelector("title").textContent=`Weather in ${myJson.name}`
            document.querySelector('h1').textContent = `Weather in ${myJson.name}`
            myImg.setAttribute('src', `https://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`);
            description.textContent=`${myJson.main.temp}${degrees}C, ${myJson.weather[0].main}`
            info.innerHTML =(`Feels like ${myJson.main.feels_like}${degrees}C<br>
                            Minimum ${myJson.main.temp_min}${degrees}C, Maximum ${myJson.main.temp_max}${degrees}C<br>
                            <br><hr width=30%><br>
                            Wind: ${myJson.wind.speed}m/s,${myJson.wind.deg}${degrees}<br>
                            Clouds: ${myJson.clouds.all}%<br>
                            Pressure: ${myJson.main.pressure}hPa<br>
                            Humidity: ${myJson.main.humidity}%<br>
                            Visibility: ${checkPresence(myJson.visibility,"km")}<br>`)
        });
}

function checkPresence(value,symbol) {
    if (value===undefined) {
        return(`(data unavailable)`)
    }else{
        return(`${value/1000}${symbol}`)
    }
}