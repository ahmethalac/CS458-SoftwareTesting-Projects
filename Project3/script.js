let timeout;
const showError = text => {
    if (timeout) clearTimeout(timeout);
    document.getElementById('errorText').textContent = text;
    timeout = setTimeout(() => {
        document.getElementById('errorText').textContent = '';  
    }, 2000);
}

let marker;
const showMarker = (coordinates, text) => {
    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({
        position: coordinates,
        map: window.map
    });
    window.infowindow.setContent(text);
    window.infowindow.open(map, marker);
}

const setMapCenter = coordinates => {
    window.map.setZoom(6);
    window.map.setCenter(coordinates);
}

const showCountry = async coordinates => {
    setMapCenter(coordinates);

    let results;
    try {
        const response = await window.geocoder.geocode({ location: coordinates });
        results = response.results;
    } catch (error) {
        if (error.code === 'ZERO_RESULTS') {
            showError('No country information found!');
        } else {
            showError('Error occurred while retrieving the country!');
        }
        return;
    }
    const { formatted_address: country } = results.find(result => result?.types.includes('country')) || {};
    if (!country) return;

    document.getElementById('country').textContent = country;

    showMarker(coordinates, country);
}

const showNorthPoleDistance = coordinates => {
    const distanceToNorthPole = google.maps.geometry.spherical.computeDistanceBetween({ lat: 90, lng: 0 }, coordinates);
    const distanceInKms = Math.floor(distanceToNorthPole / 1000);
    document.getElementById('northPole').textContent = distanceInKms;

    setMapCenter(coordinates);
    showMarker(coordinates, `${distanceInKms} kms`);
}

const showMoonDistance = coordinates => {
    const { latitude, longitude } = coordinates;
    const distanceToMoon = Math.round(window.SunCalc.getMoonPosition(new Date(), latitude, longitude).distance);
    document.getElementById('moon').textContent = distanceToMoon;

    setMapCenter(coordinates);
    showMarker(coordinates, `${distanceToMoon} kms`);
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
    await showCountry(validatedCoordinates);
});

document.getElementById('showCountry-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        await showCountry({ lat, lng });
    });
});

document.getElementById('showNorthPoleDistance').addEventListener('click', async () => {
    const lat = document.getElementById('latInput').value;
    const lng = document.getElementById('lngInput').value;
    
    const validatedCoordinates = validateLatLng(lat, lng);
    if (!validatedCoordinates) return;
    
    showNorthPoleDistance(validatedCoordinates);
});

document.getElementById('showNorthPoleDistance-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        showNorthPoleDistance({ lat, lng });
    });
});

document.getElementById('showMoonDistance').addEventListener('click', async () => {
    const lat = document.getElementById('latInput').value;
    const lng = document.getElementById('lngInput').value;
    
    const validatedCoordinates = validateLatLng(lat, lng);
    if (!validatedCoordinates) return;
    
    showMoonDistance(validatedCoordinates);
});

document.getElementById('showMoonDistance-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        showMoonDistance({ lat, lng });
    });
});