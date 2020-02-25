var myImg = document.querySelector("#weather_icon");
var myHeading = document.querySelector('#weather_head');
var location;
var description=document.querySelector("#description");
var info=document.querySelector("#info");
var degrees="\u00b0";
console.log("Hey there!")
document.getElementById("html").style.backgroundImage='url("")'
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

function setPage(myLocation,isGeo,latitude,longitude) {
    link = "https://api.openweathermap.org/data/2.5/weather?q=" + myLocation + "&units=metric&apikey=" + '499093abb9ae71e744766738f864d7d6';
    if (isGeo) {
        link="https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=499093abb9ae71e744766738f864d7d6";
    }
    fetch(link)
        .then((response) => {
            if (response.status==404) {
                alert("City not found!")
                setLocation(myLocation);
            }
            return response.json();
        })
        .then((myJson) => {
            document.querySelector("#weather_title").textContent=`Weather in ${myJson.name}`
            document.querySelector("#weather_head").textContent = `Weather in ${myJson.name}`
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

function fetchImg(url) {
    url=addEmbed(document.querySelector('#insta_url').value)
    console.log(url)
    fetch(url)
    .then((response) => {
        if (response.status==404) {
            alert("Url invalid! (Private profiles not supported)")
        }
        return response.text();
    }
    ).then((page)=>{
        var parser= new DOMParser();
        var fetchedDoc= parser.parseFromString(page, 'text/html');
        var fetchedImg= fetchedDoc.documentElement.querySelector('.EmbeddedMediaImage');
        var instaImg=fetchedImg.getAttribute('src')
        document.querySelector("#guide").innerHTML=(`Right click below image and click 'Save image as...'`)
        document.querySelector('#insta_image').setAttribute('src',instaImg)
    })
}

function checkPresence(value,symbol) {
    if (value===undefined) {
        return(`(data unavailable)`)
    }else{
        return(`${value/1000}${symbol}`)
    }
}

function addEmbed(url) {
    let index=url.indexOf("?")
    slicedUrl=url.slice(0,index)
    newUrl=slicedUrl.concat("embed")
    return newUrl
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  
  function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    setPage(undefined,true,crd.latitude,crd.longitude)
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  
  navigator.geolocation.getCurrentPosition(success, error, options);