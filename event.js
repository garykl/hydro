
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


var movable = function (elem, callback) {

  var translateFlag = false;
  var position = undefined;
  var translation = svg.getTransform(elem).translation;
  var internalElem = elem;
  var releaseCallback = function (translation) {
      if (callback !== undefined) {
          callback(translation);
      }
  }

  var transform = function () {
    svg.setTranslation(internalElem, translation);
  };

  transform();

  var toggleClickFlag = function (e) {
    var e = e || window.event;
    if (whichButton(e) === 'left') {
      translateFlag = !translateFlag;
      position = [e.pageX, e.pageY];
    }
    if (!translateFlag) {
      releaseCallback(translation);
    }
  };

  var move = function (e) {
    if (translateFlag) {
      var vector = [e.pageX - position[0], e.pageY - position[1]];
      position = [e.pageX, e.pageY];
      translation = [translation[0] + vector[0], translation[1] + vector[1]];
    }
    transform();
    releaseCallback(translation);
  };

  elem.onmousemove = move;
  elem.onmousedown = toggleClickFlag;

  return internalElem;
};

