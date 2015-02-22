
var whichButton = function (e) {
    e = e || window.event;

    var button = undefined;
    if (e.which == null) {
        button = (e.button < 2) ? 'left' :
            ((e.button == 2) ? 'middle' : 'right');
    }
    else {
        button = (e.which < 2) ? 'left' :
            ((e.which == 2) ? 'middle' : 'right');
    }

    return button;
}


var movable = function (elem, releaseCallback) {

  var translateFlag = false;
  var rotateFlag = false;
  var position = undefined;
  var translation = [0, 0];
  var rotation = 0;
  var rotationCenter = [0, 0];
  var group = svg.group([elem], {'transform': 'translate(0, 0)'});

  var transform = function () {
    svg.update(
      group,
      {'transform':
         'translate(' + translation[0] + ', ' + translation[1] + '), rotate(' + rotation + ', ' + rotationCenter[1] + ', ' + rotationCenter[1] + ')'});
  };

  transform();

  var toggleClickFlag = function (e) {
    var e = e || window.event;
    if (whichButton(e) === 'left') {
      translateFlag = !translateFlag;
      position = [e.pageX, e.pageY];
    }
    if (whichButton(e) === 'middle') {
      rotateFlag = !rotateFlag;
      rotationCenter = [e.pageX, e.pageY];
    }
    if (!translateFlag && !rotateFlag) {
      releaseCallback(translation);
    }
  };

  var move = function (e) {
    if (translateFlag) {
      var vector = [e.pageX - position[0], e.pageY - position[1]];
      position = [e.pageX, e.pageY];
      translation = [translation[0] + vector[0], translation[1] + vector[1]];
    }
    if (rotateFlag) {
      var vector = [e.pageX - rotationCenter[0], e.pageY - rotationCenter[1]];
      rotation = 180 * Math.atan2(vector[1], vector[0]) / Math.PI;
    }
    transform();
    releaseCallback(translation);
  };

  //elem.onclick = toggleClickFlag;
  elem.onmousemove = move;
  elem.onmousedown = toggleClickFlag;

  return group;
};

