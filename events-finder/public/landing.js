function initBgMap() {
  new google.maps.Map(document.getElementById('bg-map'), {
    center: { lat: 55.6761, lng: 12.5683 },
    zoom: 12,
    disableDefaultUI: true,
    styles: [
      { featureType: "all", elementType: "geometry", stylers: [{ color: "#ee9841" }] },
      { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#5a5a5a" }] },
      { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#f5f0eb" }] },
      { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#f30909" }] },
      { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#007bff" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f91212" }] },
      { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#ffe0e0" }] },
      { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#ec2121" }] },
      { featureType: "landscape.natural", elementType: "geometry.fill", stylers: [{ color: "#daede9" }] },
      { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f4d3d3" }] },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] }
    ]
  })
}

function goToMap(category) {
  window.location.href = 'map.html?category=' + category
}