var result = document.querySelector("#result")
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
            result.innerHTML = (`<br><a href="${instaImg}" title="Click for full size image">
            <img id="insta_image" src="${instaImg}" height="500px" alt="instagram image will come here!"></a><br>`)
        })
}

function addEmbed(url) {
    let index = url.indexOf("?")
    slicedUrl = url.slice(0, index)
    newUrl = slicedUrl.concat("embed")
    return newUrl
}

function fetchJson(url, isVideo) {
    localStorage.setItem('url', url);
    localStorage.setItem('isVideo', isVideo);
    if (url.indexOf("?") > -1) {
        url = url + "&__a=1"
    } else {
        url = url + "?__a=1"
    }
    fetch(url).then((response) => {
        if (response.status == 404) {
            alert("404. Please check url (Private profiles not supported).");
        } else {
            return response.json();
        }
    }).then((myJson) => {
        if (isVideo) {
            try {
                if (myJson.graphql.shortcode_media.video_url !== undefined) {
                    result.innerHTML = ''
                    vidSrc = (myJson.graphql.shortcode_media.video_url)
                    var videoElement = document.createElement("video")
                    videoElement.id = "insta_video"
                    videoElement.controls = true
                    videoElement.autoplay = false
                    videoElement.loop = true
                    videoElement.preload = "auto"
                    result.appendChild(videoElement)
                    var source = document.createElement("source")
                    source.src = vidSrc
                    document.getElementById("insta_video").appendChild(source)
                } else if (myJson.graphql.shortcode_media.edge_sidecar_to_children.edges.length > 0) {
                    var count=0
                    result.innerHTML = ''
                    noOfVids = myJson.graphql.shortcode_media.edge_sidecar_to_children.edges.length
                    for (let vidCount = 0; vidCount < noOfVids; vidCount++) {
                        var itemIsVideo=myJson.graphql.shortcode_media.edge_sidecar_to_children.edges[vidCount].node.is_video
                        if (itemIsVideo) {
                            //console.log(myJson.graphql.shortcode_media.edge_sidecar_to_children.edges[vidCount].node.video_url, vidCount,itemIsVideo);
                            vidSrc = (myJson.graphql.shortcode_media.edge_sidecar_to_children.edges[vidCount].node.video_url)
                            var videoElement = document.createElement("video")
                            videoElement.id = "insta_video"
                            videoElement.controls = true
                            videoElement.autoplay = false
                            videoElement.loop = true
                            videoElement.preload = "auto"
                            result.appendChild(videoElement)
                            var source = document.createElement("source")
                            source.src = vidSrc
                            document.querySelectorAll("#insta_video")[count].appendChild(source)
                            count+=1
                        }
                    }
                }
                else {
                    result.innerHTML = ''
                    error = document.createTextNode("Invalid url! Perhaps it is a link to an image post?")
                    //document.querySelector("#result").appendChild(error)
                }
            } catch (error) {
                console.warn(error);
                //result.innerHTML = "<p>Error fetching video</p>"
            }
        } else {
            try {
                result.innerHTML = ''
                noOfImages = myJson.graphql.shortcode_media.edge_sidecar_to_children.edges.length
                for (let imgCount = 0; imgCount < noOfImages; imgCount++) {
                    imgSrc = (myJson.graphql.shortcode_media.edge_sidecar_to_children.edges[imgCount].node.display_resources[2].src)
                    var imageElement = document.createElement("img")
                    imageElement.id = "insta_image"
                    imageElement.src = imgSrc
                    result.appendChild(imageElement)
                }
            } catch (error) {
                console.warn("Post contains a single image.")
                imgSrc = (myJson.graphql.shortcode_media.display_resources[2].src)
                var imageElement = document.createElement("img")
                imageElement.id = "insta_image"
                imageElement.src = imgSrc
                result.appendChild(imageElement)

            }
        }
    })
}

function clearResult() {
    document.querySelector('#result').innerHTML = ''
    document.querySelector('#insta_url').value = ''
    localStorage.removeItem('url')
    localStorage.removeItem('isVideo');
}