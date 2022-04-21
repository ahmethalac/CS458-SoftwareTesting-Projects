let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.86900977609979, lng: 32.748087489491354 },
    zoom: 16,
  });
}

window.initMap = initMap;