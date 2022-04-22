const setCountry = async coordinates => {
    const { results } = await window.geocoder.geocode({ location: coordinates });
    const { formatted_address: country } = results.find(result => result?.types.includes('country')) || {};
    if (!country) return;

    document.getElementById('country').textContent = country;

    window.map.setZoom(6);
    const marker = new google.maps.Marker({
        position: coordinates,
        map: window.map
    });
    window.map.setCenter(coordinates);
    window.infowindow.setContent(country);
    window.infowindow.open(map, marker);
}

document.getElementById('showCountry').addEventListener('click', async () => {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);
    if (!lat || !lng) return;

    await setCountry({ lat, lng });
});

document.getElementById('showNorthPoleDistance-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng }}) => {
        const distanceToNorthPole = google.maps.geometry.spherical.computeDistanceBetween({ lat: 90, lng: 0 }, { lat, lng });
        document.getElementById('northPole').textContent = Math.floor(distanceToNorthPole / 1000);
    });
});

document.getElementById('showNorthPoleDistance').addEventListener('click', async () => {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);
    if (!lat || !lng) return;

    const distanceToNorthPole = google.maps.geometry.spherical.computeDistanceBetween({ lat: 90, lng: 0 }, { lat, lng });
    document.getElementById('northPole').textContent = Math.floor(distanceToNorthPole / 1000);
});

document.getElementById('showCountry-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        await setCountry({ lat, lng });
    });
});