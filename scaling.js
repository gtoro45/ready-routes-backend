/* 
    Point Class defined in algorithm.js
    Google LatLng objects defined from API key
    
    Package used for some math functions as well as scaling
    for the route algorithm 
*/

function milesToMetersString(dist) {
    let m = 1000* 1.60934 * dist;
    //if distance input was 0, then set to default radius of 4000
    if(m == 0)
        m = 4000
    return m.toString();
}

function getLatLngAsPoints(nearby) {
    let nearbyLocs = [];
    for(let i = 1; i < nearby.length; i++) {
        let lat = nearby[i].geometry.viewport.Zh.hi;
        let lng = nearby[i].geometry.viewport.Jh.hi;
        nearbyLocs[i - 1] = new pt(lat,lng);
    }
    console.log("LatLng Points:\n", nearbyLocs);
    return nearbyLocs;
}

function scaleLatLngPoints(sourcePt, scaleFactor, nearbyPts) {
    let scaledLocs = []
    // string to plug points into Desmos for debugging
    let desmosPoints = '';
    for(let i = 0; i < nearbyPts.length; i++) {
        let newX = (nearbyPts[i].x - sourcePt.x) * scaleFactor;
        let newY = (nearbyPts[i].y - sourcePt.y) * scaleFactor;
        scaledLocs[i] = new pt(newX, newY);

        let data = '(' + newX + ',' + newY + ')\n';
        desmosPoints += data;
    }
    console.log("Cartesian Points:\n", scaledLocs);
    console.log("Scaled Points:\n", desmosPoints);
    return scaledLocs;
}

function descaleLatLngPoints(sourcePt, scaleFactor, scaledNearbyPts) {
    let descaled = [];
    for(let i = 0; i < scaledNearbyPts.length; i++) {
        let deX = (scaledNearbyPts[i].x / scaleFactor) + sourcePt.x;
        let deY = (scaledNearbyPts[i].y / scaleFactor) + sourcePt.y;
        descaled[i] = new pt(deX, deY);
    }
    return descaled;
}