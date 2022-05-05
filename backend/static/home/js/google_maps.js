let map;
let autocomplete_a;
let drawingManager;
let selectedShape;
let feature;

function initMap() {
    let location = new Object();
    navigator.geolocation.getCurrentPosition(function(pos){
      location.lat = pos.coords.latitude;
      location.long = pos.coords.longitude;
      map = new google.maps.Map(document.getElementById('map-route'), {
            center: {lat: location.lat, lng: location.long},
            zoom: 18,
            styles: [],
            mapTypeId: google.maps.MapTypeId.SATELLITE
      });

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
          ]
        },
        markerOptions: {
          icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        }
      });
      drawingManager.setMap(map);

      map.data.setStyle({
                        fillColor: document.getElementById("choosecolor").value,
                        strokeOpacity: 1.0,
                        strokeWeight: 3,
                        editable: true,
                      });

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        switch (event.type) {
          case google.maps.drawing.OverlayType.POLYGON:
            map.data.setStyle({
                            fillColor: document.getElementById("choosecolor").value,
                            strokeOpacity: 1.0,
                            strokeWeight: 3,
                            editable: true,
                          });
            feature = map.data.add(new google.maps.Data.Feature({
              geometry: new google.maps.Data.Polygon([event.overlay.getPath().getArray()])
            }));

            drawingManager.setOptions({
              drawingControl: false,
              drawingMode: google.maps.drawing.OverlayType.MARKER
            });

            // Add an event listener that selects the newly-drawn shape when the user
            // mouses down on it.
            var newShape = event.overlay;
            newShape.type = event.type;
            google.maps.event.addListener(newShape, 'click', function() {
              setSelection(newShape);
            });
            setSelection(newShape);
            break;
        }
      });

    });

    initAutocomplete();
}

function clearSelection() {
  if (selectedShape) {
    selectedShape.setEditable(false);
    selectedShape = null;
  }
}

function setSelection(shape) {
  clearSelection();
  selectedShape = shape;
  shape.setEditable(true);
}

function deleteSelectedShape() {
  if (selectedShape) {
    selectedShape.setMap(null);
    map.data.remove(feature);
    // To show:
    drawingManager.setOptions({
      drawingControl: true,
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    });
  }
}

function resetPoly(){
  deleteSelectedShape();
}

// JavaScript function to get cookie by name; retrieved from https://docs.djangoproject.com/en/3.1/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$("#savePolygon").click(function() {
    var URL = $("#savePolygon").attr("data-url");
    var dashboardURL = $("#savePolygon").attr("dashboard-url");
    map.data.toGeoJson(function(obj) {
      $.ajax({
          method: 'POST',
          url: URL,
          data: JSON.stringify(obj),
          dataType: 'json',
          headers: {
                  'Content-Type':'application/json',
                  'X-CSRFToken': getCookie("csrftoken")
              },
          success: function (data) {
            window.location = dashboardURL;
            },
          error: function (data) {
               console.log(data.responseText);
               window.location = dashboardURL;
          }
      });
    });

});

function initAutocomplete() {

  autocomplete_a = new google.maps.places.Autocomplete(
   document.getElementById('pac-input'),
   {
       types: ['address'],
       componentRestrictions: { country: "in" },
   })

  const geocoder = new google.maps.Geocoder();
  document.getElementById("submit").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });


  autocomplete_a.addListener('place_changed', () => {
    geocodeAddress(geocoder, map);
  });

}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("pac-input").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

function onPlaceChanged (addy){

    let auto
    let el_id
    let lat_id
    let long_id

    if ( addy === 'a'){
        auto = autocomplete_a
        el_id = 'pac-input'
        lat_id = 'id-lat-a'
        long_id = 'id-long-a'
    }

    var geocoder = new google.maps.Geocoder()
    var address = document.getElementById(el_id).value

    geocoder.geocode( { 'address': address}, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            $('#' + lat_id).val(latitude)
            $('#' + long_id).val(longitude)
        }
    });
}


// Handles click events on a map, and adds a new point to the Polyline.
function addLatLng(event) {
  map.data.setStyle({
                    strokeColor: document.getElementById("choosecolor").value,
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    editable: true,
                  });
  //const path = poly.getPath();
  // Because path is an MVCArray, we can simply append a new coordinate
  // and it will automatically appear.
  //path.push(event.latLng);
  // Add a new marker at the new plotted point on the polygon.
  /*new google.maps.Marker({
    position: event.latLng,
    title: "#" + path.getLength(),
    map: map,
  });*/
}
