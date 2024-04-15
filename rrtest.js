var map;

//this functions creates the actual map we are able to see in the HTML page 
function initMap() {
  // assigns directions services to javacript constants to avoid typing everything asll over again
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({draggable:true,}); //draggable makes it so that we can drag the legs of the loop and modify

  console.log("Live");

  //create the map and assigns it to the div in HTML with the corresponding Id
  map = new google.maps.Map(document.getElementById("map"), {
    //30.6149996259997, -96.34153199058316 A&M University coordinates
    center: { lat: 30.614, lng: -96.34},
    zoom: 15,
    mapTypeId: 'hybrid'
  });

  directionsRenderer.setMap(map);

  //Uses Places API so that it autocompletes when typing in the inputs, have to do it for each input
  //each input is given a different Id in HTML
  let sourceAutocomplete = new google.maps.places.Autocomplete(document.getElementById("source"));

  //when the button with the "submit" id is click the calcRoute function runs
  document.getElementById("submit").addEventListener("click", () => {
    var source = document.getElementById("source").value;
    route(directionsService, directionsRenderer, source);
  });
}


// main logic function calls a ton of promises
function route(directionsService, directionsRenderer, sourceAddr) {
  //get the source address and distance information 
  var distance = milesToMetersString(document.getElementById("distance").value);
  console.log(distance, "m");
  
  var geocoderService = new google.maps.Geocoder();
  
  // get source geolocation data -> returned by promise as sourceGeoLoc
  geocodePromise(sourceAddr, geocoderService).then((sourceGeoLoc => {
    // use the source data to get a list of nearby waypoints -> returned by promise as nearbyList
    nearbyLocationsPromise(sourceGeoLoc, distance).then((nearbyList) => {
			let waypoints = generateCorners(distance, sourceGeoLoc, nearbyList);
			displayRoute(waypoints, directionsService, directionsRenderer);
  
      // catch any promise rejections
    }).catch((error) => {
      console.log(error);
    })
  })).catch((error) => {
    console.log(error);
  });
}


// corner generating algorithm based on the source and its nearby waypoints
function generateCorners(distance, source, nearby) {
  // convert lat/lng to points and scale to cartesian grid
  let nearbyLocs = getLatLngAsPoints(nearby);
  let sourcePt = new pt(source.latitude, source.longitude);
  let scaleFactor = 500;
  let scaledLocs = scaleLatLngPoints(sourcePt, scaleFactor, nearbyLocs);
  console.log(getAverageXY(scaledLocs));

  // generate the loop using the scaled points, and then descale
  var slices = 7;
  let scaledLoop = genLoop(distance, slices, scaledLocs, sourcePt);
  let descaledRoute = descaleLatLngPoints(scaledLoop);
  
  let waypoints = []
  // TODO
  return waypoints;
}

// calcRoute function is defined and the google services will need to be passed as parameters since we will use
// them here again
function displayRoute(waypnt, directionsService, directionsRenderer){
  //gets the values typed by the user into the HTML inputs and assigns it to a javascript variable 
  var source = document.getElementById("source").value; 

  //object that will be used in directionsService.route 
  let request = {
      origin: source,
      destination: source, //source is assigned to both origin and destination since we want a closed loop
      waypoints: waypnt, //waypoint array used here 
      travelMode: "WALKING", //this can be changed to DRIVING, BICYCLING, TRANSIT, etc
      //there are more details that can be added to this object but not necessary for this program
  };

  //asks the directions api for a route using the previously defined object
  //and a callback function
  directionsService.route(request, function(result, status){
      if(status == 'OK'){
          //renders the route on the map
          directionsRenderer.setDirections(result); 
      }
  });
}


//runs the initMap functions, which sequentially calls the others functions
window.initMap = initMap;


 
 
