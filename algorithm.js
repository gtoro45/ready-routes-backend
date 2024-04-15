// point class
class pt {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function inDistRange(source, other, lowerRadius, upperRadius){
    return ( Math.sqrt(Math.pow(source.x - other.x, 2) + Math.pow(source.y - other.y, 2)) <= upperRadius ) && ( Math.sqrt(Math.pow(source.x - other.x, 2) + Math.pow(source.y - other.y, 2)) >= lowerRadius );
}

function inAngleRange(source, other, lowerAngle, upperAngle){
    // atan(y/x) goes from [-pi/2, pi/2], so we must split into two cases
    if(other.x < source.x && Math.atan((other.y - source.y) / (other.x - source.x)) <= upperAngle - Math.PI && Math.atan((other.y - source.y) / (other.x - source.x)) >= lowerAngle - Math.PI){
        return true;
    }
    else if(Math.atan((other.y - source.y) / (other.x - source.x)) <= upperAngle && Math.atan((other.y - source.y) / (other.x - source.x)) >= lowerAngle){
        return true;
    }
    return false;
}

// returns a point from the array of potential points within the region specified by the params with respect to the source
function selectPt(lowerAngle, upperAngle, lowerRadius, upperRadius, potentialPts, source) {
    // loop through potential points, return point if it is within range
    for(var i = 0; i < potentialPts.length; i++){
        if(inDistRange(source, potentialPts[i], lowerRadius, upperRadius) && inAngleRange(source, potentialPts[i], lowerAngle, upperAngle)){
            return potentialPts[i];
        }
    }

    // possible solution for points not found. Expand search region.
    return selectPt(lowerAngle*.9, upperAngle, lowerRadius, upperRadius*1.1, potentialPts, source);

    // if no point in region
    // return new pt(-1,-1);
}

// create an array containing the points of the loop in order
function genLoop(dist, slices, potentialPts, source) {
    var scale = 1.3;                       // scale factor of distance (to try to get a loop closer to desired distance)
    var diam = dist / Math.PI * scale;   // approximate diameter of circle to get a loop of circumference dist
    var radii = Math.ceil(slices / 2);   // number of different radius intervals needed to run algorithm properly
    var pts = new Array(slices);         // array to store the points that form the loop

    // loop to generate points with correct angle and distance ranges
    for (var i = 0; i < slices; i++) {
        if (i <= slices / 2) {
            pts[i] = selectPt(i / slices * Math.PI, (i + 1) / slices * Math.PI, i / radii * diam, (i + 1) / radii * diam, potentialPts, source);
        } else {
            pts[i] = selectPt(i / slices * Math.PI, (i + 1) / slices * Math.PI, (slices - i - 1) / radii * diam, (slices - i) / radii * diam, potentialPts, source);
        }
    }

    return pts;
}

function getAverageXY(list) {
    let sumX = 0;
    let sumY = 0;
    for(let i = 0; i < list.length; i++) {
        sumX += list[i].x;
        sumY += list[i].y;
    }
    return new pt(sumX / list.length, sumY / list.length);
}