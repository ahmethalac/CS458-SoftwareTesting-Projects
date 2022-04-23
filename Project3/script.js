let marker;
const setCountry = async coordinates => {
    const { results } = await window.geocoder.geocode({ location: coordinates });
    const { formatted_address: country } = results.find(result => result?.types.includes('country')) || {};
    if (!country) return;

    document.getElementById('country').textContent = country;

    window.map.setZoom(6);

    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        position: coordinates,
        map: window.map
    });
    window.map.setCenter(coordinates);
    window.infowindow.setContent(country);
    window.infowindow.open(map, marker);
}

const setLocation = async coordinates => {
    const distanceToNorthPole = google.maps.geometry.spherical.computeDistanceBetween({ lat: 90, lng: 0 }, coordinates);
    const distanceInKms = Math.floor(distanceToNorthPole / 1000);
    document.getElementById('northPole').textContent = distanceInKms;

    window.map.setZoom(6);
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        position: coordinates,
        map: window.map
    });
    window.map.setCenter(coordinates);
    window.infowindow.setContent(`${distanceInKms} kms`);
    window.infowindow.open(map, marker);
}

let timeout;
const showError = text => {
    if (timeout) clearTimeout(timeout);
    document.getElementById('errorText').textContent = text;
    timeout = setTimeout(() => {
        document.getElementById('errorText').textContent = '';  
    }, 2000);
}

const validateLatLng = (lat, lng) => {
    if (lat === '') {
        showError('Latitude cannot be empty!');
        return false;
    }
    if (lng === '') {
        showError('Longitude cannot be empty!');
        return false;
    }

    const numberLat = parseFloat(lat);
    const numberLng = parseFloat(lng);
    
    if (isNaN(numberLat)) {
        showError('Latitude must be number!');
        return false;
    }
    if (isNaN(numberLng)) {
        showError('Longitude must be number!');
        return false;
    }
    if (numberLat <= -90 || numberLat >= 90) {
        showError('Latitude must be in range (-90, 90)!');
        return false;
    }
    if (numberLng <= -180 || numberLng >= 180) {
        showError('Longitude must be in range (-180, 180)!');
        return false;
    }
    return { lat: numberLat, lng: numberLng };
};

document.getElementById('showCountry').addEventListener('click', async () => {
    const lat = document.getElementById('latInput').value;
    const lng = document.getElementById('lngInput').value;

    const validatedCoordinates = validateLatLng(lat, lng);
    if (!validatedCoordinates) return;
    await setCountry(validatedCoordinates);
});

document.getElementById('showCountry-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        await setCountry({ lat, lng });
    });
});

document.getElementById('showNorthPoleDistance').addEventListener('click', async () => {
    const lat = document.getElementById('latInput').value;
    const lng = document.getElementById('lngInput').value;
    
    const validatedCoordinates = validateLatLng(lat, lng);
    if (!validatedCoordinates) return;
    
    setLocation(validatedCoordinates);
});

document.getElementById('showNorthPoleDistance-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        setLocation({ lat, lng });
    });
});