function fetchImg(url) {
    url = addEmbed(document.querySelector('#insta_url').value)
    fetch(url)
        .then((response) => {
            if (response.status == 404) {
                alert("Url invalid! (Note: Private profiles not supported)")
            }
            return response.text();
        }
        ).then((page) => {
            var parser = new DOMParser();
            var fetchedDoc = parser.parseFromString(page, 'text/html');
            var fetchedImg = fetchedDoc.documentElement.querySelector('.EmbeddedMediaImage');
            var instaImg = fetchedImg.getAttribute('src')
            document.querySelector("#guide").innerHTML = (`Right click below image and click 'Save image as...'`)
            document.querySelector('#insta_image').setAttribute('src', instaImg)
        })
}

function addEmbed(url) {
    let index = url.indexOf("?")
    slicedUrl = url.slice(0, index)
    newUrl = slicedUrl.concat("embed")
    return newUrl
}