document.getElementById('showCountry').addEventListener('click', async () => {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);
    if (!lat || !lng) return;

    const { results } = await window.geocoder.geocode({ location: { lat, lng } });
    const { formatted_address: country } = results.find(result => result?.types.includes('country')) || {};
    if (!country) return;

    document.getElementById('country').textContent = country;

    window.map.setZoom(6);
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: window.map
    });
    window.map.setCenter({ lat, lng });
    window.infowindow.setContent(country);
    window.infowindow.open(map, marker);
});

document.getElementById('showNorthPoleDistance').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(({ coords: { latitude: lat, longitude: lng }}) => {
        const distanceToNorthPole = google.maps.geometry.spherical.computeDistanceBetween({ lat: 90, lng: 0 }, { lat, lng });
        document.getElementById('northPole').textContent = Math.floor(distanceToNorthPole / 1000);
    });
});

document.getElementById('showCountry-autoGPS').addEventListener('click', async () => {
    window.navigator.geolocation.getCurrentPosition(async ({ coords: { latitude: lat, longitude: lng }}) => {
        const { results } = await window.geocoder.geocode({ location: { lat, lng } });
        const { formatted_address: country } = results.find(result => result?.types.includes('country')) || {};
        if (!country) return;
    
        document.getElementById('country').textContent = country;
    
        window.map.setZoom(6);
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map: window.map
        });
        window.map.setCenter({ lat, lng });
        window.infowindow.setContent(country);
        window.infowindow.open(map, marker);
    });
});