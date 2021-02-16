//setting up initial coordinates and zoom for the map creation
const mymap = L.map('mapofISS').setView([0, 0], 3.5);
//setting up the image for the iss and red circle.
const ISSicon = L.icon({
    iconUrl: './assets/media/issimage-3.png',
    iconSize: [80, 72],
    iconAnchor: [40, 36]
});

// setting up marker for map
const marker = L.marker([0, 0], {
    icon: ISSicon
}).addTo(mymap);


// setting up image tiles that will be the map and including watermarks and copyrights 
const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia2FsdWxhIiwiYSI6ImNrYW8zZWNwcTA5bXAzMXFuNXp1NHF6Y2sifQ.2gHNbh6FhEFtfqp4zEcDtQ'
}).addTo(mymap);
// when you click on the map a popup shows lat & long
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("This is at " + e.latlng.toString())
        .openOn(mymap);
}
mymap.on('click', onMapClick);

// setting up a boolean when the page is first loaded/refreshed the page view will focus on the ISS current location
// And fetched the ISS API data 
const api_url = 'http://api.open-notify.org/iss-now.json'
let firstTime = true;
async function getISSdata() {
    const apiresponse = await fetch(api_url);
    const data = await apiresponse.json();
    const {
        latitude,
        longitude
    } = data;
    // a function to center on the ISS location on the map by using a check box as a toggle.
    function centerIss() {
        var checkBox = document.getElementById("checkisscenter");

        if (checkBox.checked == true) {
            mymap.setView([data.iss_position.latitude, data.iss_position.longitude], mymap.getZoom());
        } else {
            console.log("ISS not centered")
        }
    }

    centerIss();
    // makes the iss icon follows the current coordinates and continue to move along with it.
    marker.setLatLng([data.iss_position.latitude, data.iss_position.longitude]);
    if (firstTime) {
        mymap.setView([data.iss_position.latitude, data.iss_position.longitude], 3.5);
        firstTime = false;
    }

    // displays the data of the latitude & longitude in real time 
    document.getElementById('lati').textContent = data.iss_position.latitude;
    document.getElementById('long').textContent = data.iss_position.longitude;

}
getISSdata();
// refreshing the map 
function updateMap() {
    var interval = setTimeout(updateMap, 1000);
    setTimeout(getISSdata, 1000);
}
updateMap();

// -------------------------- Contact --------------------------- // 


function checkEmail(email) {
    var regex = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi;
    return regex.test(email);
}