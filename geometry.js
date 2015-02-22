var vectorLength = function(vector) {
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};


var normalize = function (vector) {
  var l = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  return [vector[0] / l, vector[1] / l];
};
