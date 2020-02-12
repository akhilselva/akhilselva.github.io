var myImg = document.querySelector("img");
var myHeading = document.querySelector('h1');
var location;
var description=document.querySelector("#description");
var info=document.querySelector("#info");
var degrees="\u00b0";
console.log("Hey there!")
function setLocation() {
    myLocation = prompt("Please enter city name")
    if (myLocation === "" || myLocation === null) {
        setLocation();
    }
    localStorage.setItem('location', myLocation)
    setPage();
}

if (!(localStorage.getItem('location'))) {
    setLocation();
    setPage();
} else {
    myLocation = localStorage.getItem('location')
    //myHeading.textContent = `Mozilla is cool,${myLocation}!`;
    setPage();
}

function setPage(params) {
    link = "https://api.openweathermap.org/data/2.5/weather?q=" + localStorage.getItem('location') + "&units=metric&apikey=" + '499093abb9ae71e744766738f864d7d6';
    fetch(link)
        .then((response) => {
            console.log(link)
            if (response.status==404) {
                alert("City not found!")
                setLocation();
            }
            return response.json();
        })
        .then((myJson) => {
            console.log(myJson);
            document.querySelector('h1').textContent = `Weather in ${myJson.name}`
            // var imgSrc = myImg.getAttribute("src");
            // console.log(imgSrc)
            myImg.setAttribute('src', `http://openweathermap.org/img/wn/${myJson.weather[0].icon}@2x.png`);
            description.textContent=`${myJson.main.temp}${degrees}C, ${myJson.weather[0].main}`
            info.innerHTML =(`Feels like ${myJson.main.feels_like}${degrees}C<br>`)
            info.innerHTML +=(`Minimum ${myJson.main.temp_min}${degrees}C, Maximum ${myJson.main.temp_max}${degrees}C<br>`)
            info.innerHTML +=(`<br>`)
            info.innerHTML +=(`<hr width=30%>`)
            info.innerHTML +=(`<br>`)
            info.innerHTML +=(`Wind: ${myJson.wind.speed}m/s,${myJson.wind.deg}${degrees}<br>`)
            info.innerHTML +=(`Clouds: ${myJson.clouds.all}%<br>`)
            info.innerHTML +=(`Pressure: ${myJson.main.pressure}hPa<br>`)
            info.innerHTML +=(`Humidity: ${myJson.main.humidity}%<br>`)
            info.innerHTML +=(`Visibility: ${checkPresence(myJson.visibility,"km")}<br>`)

        });
}

function checkPresence(value,symbol) {
    if (value===undefined) {
        return(`(data unavailable)`)
    }else{
        return(`${value/1000}${symbol}`)
    }
}