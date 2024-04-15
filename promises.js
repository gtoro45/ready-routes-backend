// returns a promise containing the address LatLng informtaion
// since it is a callback function
function geocodePromise(address, service) {
  console.log(address);
  return new Promise(function(resolve, reject) {
    service.geocode({'address': address}, function(results, status) {
      if(status == google.maps.GeocoderStatus.OK) {
        //resolve
        resolve({
          latitude: results[0].geometry.location.lat(), 
          longitude: results[0].geometry.location.lng()
        });
      }
      else {
        //reject
        reject("Geolocation data not resolved for " + address);
      }
    });
  })
}

// returns a promise containing a list of nearby locations based
// on the source and distance radius.
// uses pagination to return 60 instead of 20 locations
function nearbyLocationsPromise(source, distance) {
  return new Promise(function(resolve, reject) {
    // call the places service to get an array of nearby places within a
    // radius of size distance from the source, and use to find waypoints
    let sourceLatLng = new google.maps.LatLng(source.latitude, source.longitude);
    let placesService = new google.maps.places.PlacesService(map);
    var request = {
      location: sourceLatLng, 
      radius: distance
    };
    // grander scope array to allow for pagination
    // to store all 60 locations in one container
    allLocations = [];

    placesService.nearbySearch(request, function(result, status, pagination) {
      if(status == google.maps.places.PlacesServiceStatus.OK) {
        // paginate and add to array before resolution
        allLocations = allLocations.concat(result);
        if(pagination.hasNextPage) {
          pagination.nextPage();
        }
        else {
          // resolve
          resolve(allLocations);
        }
      }
      else {
        // reject
        reject("Could not get nearby locations for " + source);
      }
    });

  });
}

// returns a promise containing the distance data between points pointA and pointB
// in the traveling order A --> B, where pointA and pointB are Places Objects
function distancePromise(pointA, pointB) {
  //TODO: make the request from pointA and pointB
  var request = {};
  return new Promise(function(resolve, reject) {
    var distanceMatrixService = new google.maps.DistanceMatrixService();
    distanceMatrixService.getDistanceMatrix(request, function(result, status) {
      if(status == google.maps.DistanceMatrixStatus.OK) {
        //resolve
        //TODO
      }
      else {
        //reject
        //TODO
      }
    });
  });
}
