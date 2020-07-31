const debug = true

if (!debug) {
    console.log = console.error = console.warn = function () { };
}

const fullUrl = document.querySelector(".form-control-static").innerText

try {
    if (vtData) { //get stuff from variabkle if it exists, if not, fetch from API.
        pasteFromVar(vtData)
    }
} catch (error) {
    console.error(error)
}

try {
    var subdomain = document.querySelector("#sflag").parentElement.querySelector("a").innerText === "" ? document.querySelector("#domainlabel").innerText : document.querySelector("#sflag").parentElement.querySelector("a").innerText
} catch (error) {
    pasteToPage("", "", true, error);
    var subdomain = "";
}


document.querySelector("#insightFrm").insertAdjacentHTML("beforeend", `<p id="VTerrorMsg"></p>`)
console.log(subdomain);

const apiUrlResource = `https://report.brandlock.io/virustotal/url?resource=`
const apiUrlDomain = `https://report.brandlock.io/virustotal/domain?domain=`
const vtInfoSaveURL = 'https://report.brandlock.io/virustotal/save'
const description = { scriptID: window.location.href.slice(window.location.href.indexOf("x/") + 2), "domainScanDetected": {}, "domainScanUndetected": {} }
var descriptionBox = document.querySelector("#inputAutogrow")

document.querySelector("#update").insertAdjacentHTML("afterend", `&nbsp&nbsp<a id="VTbutton" class="btn btn-primary" onclick=fetchDomainInfo(apiUrlDomain+subdomain)>Get VirusTotal reports</a>`)

async function fetchDomainInfo(url) {

    //removing the Save to db button each time user clicks on fetch, will paste on page only if no errors happen
    try {
        document.querySelector("#PostVTdata").remove();
    } catch (error) { }
    console.log("url to fetch=> " + url)
    fetch(url)
        .then(res => {
            console.log("response url=> " + res.url)
            return res.json()
        })
        .then(responseMomJson => {
            console.log(responseMomJson.response.statusCode, responseMomJson.response.headers["x-api-message"])
            errorResponse(responseMomJson.response.statusCode)
            errorStatusCodes = [204, 400, 403];
            if (errorStatusCodes.includes(responseMomJson.response.statusCode)) {
                return true;
            }
            var responseJson = JSON.parse(responseMomJson.body)
            if (responseJson.response_code) {
                if (responseJson.detected_urls.length > 0) {
                    console.log("detected urls-", responseJson.detected_urls.length)
                    responseJson.detected_urls.sort((a, b) => (b.positives / b.total) - (a.positives / a.total))
                    for (let index = 0; index < 10; index++) { //keepin it short in the dictionary to save space!
                        if (!responseJson.detected_urls.length) {
                            break;
                        }
                        description["domainScanDetected"][responseJson.detected_urls[index].url] = {
                            positives: responseJson.detected_urls[index].positives,
                            total: responseJson.detected_urls[index].total
                        }

                    }
                    responseJson.undetected_urls.sort((a, b) => (b[2] / b[3]) - (a[2] / a[3]))
                    for (let index = 0; index < 10; index++) {
                        if (!responseJson.undetected_urls.length) {
                            break;
                        }
                        description["domainScanUndetected"][responseJson.undetected_urls[index][0]] = {
                            positives: responseJson.undetected_urls[index][2],
                            total: responseJson.undetected_urls[index][3]
                        }

                    }
                } else {
                    var msg = "Virustotal API :" + responseJson.verbose_msg + ", but no malicious records seen. (fetchDomainInfo)"
                    console.warn(msg)
                    pasteToPage("", "", true, msg, true)
                }
            } else {
                var msg = "Virustotal API :" + responseJson.verbose_msg + " (fetchDomainInfo)"
                console.warn(msg)
                pasteToPage("", "", true, msg, true)
            }
        })
        .then((error) => { if (error) { return }; fetchResourceInfo(apiUrlResource + fullUrl, fullUrl); })
        .catch(error => { console.warn("fetchDomainInfo" + error); pasteToPage("", "", true, error, true) })
}



async function fetchResourceInfo(url, resource) {
    // console.log(url);
    fetch(url)
        .then(res => {
            //console.log(res);
            return res.json()
        })
        .then(responseMomJson => {
            //console.log(responseMomJson.response.statusCode, responseMomJson)
            errorResponse(responseMomJson.response.statusCode)
            var responseJson = JSON.parse(responseMomJson.body)
            //console.log(responseJson)
            if (responseJson.response_code) {
                description.meta = {
                    message: responseJson.verbose_msg,
                    positives: responseJson.positives,
                    total: responseJson.total,
                }
                description.engines = getPositives(responseJson.scans)
                console.log(description)
                pasteToPage(description, resource);
                document.querySelector("#VTbutton").insertAdjacentHTML("afterend", `&nbsp&nbsp<a id="PostVTdata" class="btn btn-primary" onclick=postVTdata(description)>Save VT data</a>`)
            } else {
                var msg = "Virustotal API :" + responseJson.verbose_msg + " (fetchResourceInfo)"
                console.warn(msg)
                pasteToPage("", "", true, msg)
                //descriptionBox.value = msg
            }
        }).catch(error => { console.warn("fetchResourceInfo" + error); pasteToPage("", "", true, error) })
}



function getPositives(scanData) {
    var engines = []
    for (let [key, value] of Object.entries(scanData)) {
        if (value.detected) {
            obj = {
                engine: key,
                result: value.result
            }
            engines.push(obj)
        }
    }
    return engines;
}


function pasteToPage(description, resource, failed, errorMsg, fetchingDomainInfo) {
    try {
        document.querySelector("#VTresourceData").innerHTML = "";
        document.querySelector("#VTdomainData").innerHTML = "";

    } catch (error) {
        console.error(error)
    }
    if (fetchingDomainInfo) { document.querySelector("#VTerrorMsg").innerHTML = ""; };
    if (failed) {
        document.querySelector("#VTerrorMsg").innerHTML += `VirusTotal API : ${errorMsg}<br><br>`
    } else {
        document.querySelector("#VTresourceData").innerHTML = `
    <br><a onclick=toggleView(document.querySelector('#VTresourceInsights'))><h4>VirusTotal Scan results of ${resource}</h4></a><br>
    <div id="VTresourceInsights" style="display:none"><label class="col-md-2 control-label">Response:</label>
    <p class="form-control-static col-md-2"><i>${description.meta.message}</i></p>
    <label class="col-md-2 control-label">Insights:</label>
    <p class="form-control-static col-md-2"><i>${description.meta.positives} out of </i>${description.meta.total} (${((description.meta.positives / description.meta.total) * 100).toFixed(3)}%) engines returned malicious.</p>
    <table class="table table-striped" style="text-align: center;"><tbody id="virusEngines"></tbody></table>
    </div><br>`
        virusEngines = document.querySelector("#virusEngines")
        virusEngines.innerHTML += `<br><br><h4 style="text-align: left;">AV enignes that returned malicious</h4><br>`
        description.engines.forEach(object => {
            virusEngines.innerHTML += `<td><p>${object.engine}</p></td><td><p>${object.result}</p></td>`
        });


        //Table of domain scan results
        table = document.createElement("table")
        table.className = "table table-striped"
        table.id = "virustotalTable";
        table.style = "display:none; text-align: center;"
        //Table of detected URLs
        tableBody = document.createElement("tbody")
        tableBody.id = "virustotal"
        //Table of undetected URLs
        tableBody2 = document.createElement("tbody")
        tableBody2.id = "virustotalUndetected"
        document.querySelector("#VTdomainData").innerHTML += `<br><a onclick=toggleView(document.querySelector('#virustotalTable'))><h4>VirusTotal Scan results of Subdomain/Domain</h4></a>`
        document.querySelector("#VTdomainData").appendChild(table);
        document.querySelector("#virustotalTable").appendChild(tableBody);
        document.querySelector("#virustotalTable").appendChild(tableBody2);
        tableBody.insertAdjacentHTML('beforebegin', `<h5>Detected URLs</h5>`)
        var count = 0;
        for (let [key, value] of Object.entries(description["domainScanDetected"])) {
            if (count > 14) {
                document.querySelector("#virustotal").innerHTML += `<p>...and ${Object.keys(description["domainScanDetected"]).length - count} more.`;
                break;
            }
            document.querySelector("#virustotal").innerHTML += `<td>
        <p><a onclick="window.navigator.clipboard.writeText('${key}')" href="https://www.virustotal.com/gui/home/url" id="${key}">${key}</a></p>
        </td>
        <td><p class="form-control-static col-md-2">${value.positives}<i> out of </i>${value.total} (${((value.positives / value.total) * 100).toFixed(3)}%) engines returned malicious.</p></td>`;
            count += 1;
        }
        count = 0;
        for (let [key, value] of Object.entries(description["domainScanUndetected"])) {
            if (count > 2) {
                document.querySelector("#virustotalUndetected").innerHTML += `...and ${Object.keys(description["domainScanUndetected"]).length - count} more.`;
                break;
            }
            document.querySelector("#virustotalUndetected").innerHTML += `<td >
            <p><a onclick="window.navigator.clipboard.writeText('${key}')" href="https://www.virustotal.com/gui/home/url" id="${key}">${key}</a></p>
        </td>
        <td ><p class="form-control-static col-md-2">${value.positives}<i> out of </i>${value.total} (${((value.positives / value.total) * 100).toFixed(3)}%) engines returned malicious.</p></td>`;
            count += 1;
        }
        tableBody2.insertAdjacentHTML('beforebegin', `<h5>Undetected URLs</h5>`)

    }
    console.log(JSON.stringify(description, null, "\t"))
}


function toggleView(element) {
    if (element.style.display === 'none' || element.style.display === unidentified) {
        element.style.display = ''
    } else {
        element.style.display = 'none'
    }
}

function errorResponse(status) {
    if (status === 204) {
        errorText = `Request rate limit exceeded. You are making more requests than allowed. You have exceeded one of your quotas (minute, daily or monthly). Daily quotas are reset every day at 00:00 UTC.`
        pasteToPage("", "", true, errorText, true)
    }
    if (status === 400) {
        errorText = `Bad request. Your request was somehow incorrect. This can be caused by missing arguments or arguments with wrong values.`
        pasteToPage("", "", true, errorText, true)
    }
    if (status === 403) {
        errorText = `Forbidden. You don't have enough privileges to make the request. You may be doing a request without providing an API key or you may be making a request to a Private API without having the appropriate privileges.`
        pasteToPage("", "", true, errorText, true)
    }
}


function postVTdata(data) {
    const dataToSave = {
        script_id: data.scriptID,
        meta: data.meta,
        engines: data.engines,
        domains: "",
        urls: {
            cleanURLs: data.domainScanUndetected,
            dirtyURLs: data.domainScanDetected,
        }
    }
    console.log(JSON.stringify(dataToSave, null, "\t"));
    var xhr = new XMLHttpRequest();
    xhr.open("POST", vtInfoSaveURL, true);
    xhr.send(JSON.stringify(dataToSave));
}

function pasteFromVar(variable) {
    var dataToPaste={
        domainScanDetected:JSON.parse(variable.urls).dirtyURLs,
        domainScanUndetected:JSON.parse(variable.urls).cleanURLs,
        meta:JSON.parse(variable.meta),
        engines:JSON.parse(variable.engines)
    }
    pasteToPage(dataToPaste,fullUrl);
}