var oseen = function (a, b, dr) {
  var l = Math.sqrt(dr[0] * dr[0] + dr[1] * dr[1]);
  var res = dr[a] * dr[b] / (l * l * l);
  if (a === b) {
    res = res + 1 / l;
  }
  return res;
};


var propagateForce = function (position, force, to) {
  var dr = [to[0] - position[0], to[1] - position[1]];
  var v = [0, 0];
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      v[j] += oseen(i, j, dr) * force[i] / (8 * Math.PI);
    }
  }
  return v;
};


var propagateForces = function (positions, forces, to) {
  return R.reduce(function (a, b) {
                    return [a[0] + b[0], a[1] + b[1]];
                  },
                  [0, 0],
                  R.zipWith(function (p, f) {
                              return propagateForce(p, f, to);
                            },
                            positions,
                            forces));
};

