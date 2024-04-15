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
  });

  directionsRenderer.setMap(map);

  //Uses Places API so that it autocompletes when typing in the inputs, have to do it for each input
  //each input is given a different Id in HTML
  let sourceAutocomplete = new google.maps.places.Autocomplete(document.getElementById("source"));

  //when the button with the "submit" id is click the calcRoute function runs
  document.getElementById("submit").addEventListener("click", () => {
    route(directionsService, directionsRenderer);
  });
}


// main logic function calls a ton of promises
function route(directionsService, directionsRenderer) {
  //get the source address and distance information 
  var sourceAddr = document.getElementById("source").value; 
  var distance = document.getElementById("distance").value;
  var geocoderService = new google.maps.Geocoder();
  
  // get source geolocation data -> returned by promise as sourceGeoLoc
  geocodePromise(sourceAddr, geocoderService).then((sourceGeoLoc => {
    // use the source data to get a list of nearby waypoints -> returned by promise as nearbyList
    nearbyLocationsPromise(sourceGeoLoc).then((nearbyList) => {
			let waypoints = generateCorners(distance, sourceGeoLoc, nearbyList);
			// call displayRoute() to show on map
			displayRoute(waypoints, directionsService, directionsRenderer);
    
    // catch any promise rejections
    }).catch((error) => {
      console.log(error);
    })
  })).catch((error) => {
    console.log(error);
  });
}



// corner generating algorithm based on the source and its
// nearby waypoints
function generateCorners(distance, source, nearby) {
  // generate parallel lists: 
  // one with just lat/lng
  // one with lat/lng scaled to cartesian
  sourcePt = new pt(source.latitude, source.longitude);
  let nearbyLocs = [];
  for(let i = 1; i < nearby.length; i++) {
    let lat = nearby[i].geometry.viewport.Zh.hi;
    let lng = nearby[i].geometry.viewport.Jh.hi;
    nearbyLocs[i - 1] = new pt(lat,lng);
  }

  let scaleFactor = 500;
  let scaledLocs = []
  let str = '';
  for(let i = 0; i < nearbyLocs.length; i++) {
    let newX = (nearbyLocs[i].x - sourcePt.x) * scaleFactor;
    let newY = (nearbyLocs[i].y - sourcePt.y) * scaleFactor;
        
    let data = '(' + newX + ',' + newY + ')\n';
    str += data;

    scaledLocs[i] = new pt(newX, newY);
  }

  console.log(str);
  console.log(nearbyLocs);
  console.log(scaledLocs);

  var slices = 7;
  let loop = genLoop(distance, slices, scaledLocs, sourcePt);
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


 
 
