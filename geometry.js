var vectorLength = function(vector) {
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};


var normalize = function (vector) {
  var l = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  return [vector[0] / l, vector[1] / l];
};


var vectorOrientation = function (vector) {
    return Math.atan2(vector[1], vector[0]);
};


var vectorAdd = R.zipWith(R.add);

var vectorNegate = R.map(function (v) { return -v; });

var vectorSub = function (v1, v2) {
    return vectorAdd(v1, vectorNegate(v2));
}
