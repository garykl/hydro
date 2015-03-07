var SVG = function () {

    var svgns = 'http://www.w3.org/2000/svg';


    var create = function(name, attrs) {
        var elem = document.createElementNS(svgns, name);
        var props = R.toPairs(attrs);
        R.map(function (prop) { elem.setAttribute(prop[0], prop[1]); }, props);
        return elem;
    };


    var update = function(elem, attrs) {
        var props = R.toPairs(attrs);
        R.map(function (prop) { elem.setAttribute(prop[0], prop[1]); }, props);
        return elem;
    };


    var inspectAll = function(elem) {
        var inspection = R.compose(
                R.fromPairs,
                R.map(function (node) {
                    return [node.nodeName, node.nodeValue];
                }));
        return inspection(elem.attributes);
    }


    var line = function(r1, r2, attrs) {
        var props = {'x1': r1[0], 'x2': r2[0], 'y1': r1[1], 'y2': r2[1]}
        return create('line', R.merge(props, attrs));
    };


    var polygon = function(points, attrs) {
        var pointString = R.reduce(function (a, b) { return a + b; }, '',
                R.map(function (point) {
                    return point[0] + ', ' + point[1] + ' ';
                }, points));
        var props = {'points': pointString};
        return create('polygon', R.merge(props, attrs))
    };


    var group = function (elems, attrs) {;
        var g = create('g', attrs)
            R.map(function (e) { g.appendChild(e); }, elems);
        return g;
    };


    var arrow = function (attrs) {

        var position = [0, 0];
        var vector = [1, 0];
        var dx, dy, d = 0.05 * vectorLength(vector);
        if (vector[0] === 0) {
            dy = 0;
            dx = d;
        }
        else if (vector[1] === 0) {
            dx = 0;
            dy = d;
        }
        else {
            x = 1.0;
            y = -x * vector[0] / vector[1];
            dd = normalize([x, y]);
            dx = dd[0] * d;
            dy = dd[1] * d;
        }

        return polygon([[position[0] - 0.5 * vector[0] - dx,
                position[1] - 0.5 * vector[1] - dy],
                [position[0] + 0.5 * vector[0],
                position[1] + 0.5 * vector[1]],
                [position[0] - 0.5 * vector[0] + dx,
                position[1] - 0.5 * vector[1] + dy]], attrs);
    };

    var getTransform = function (elem) {
        var transform = elem.getAttribute('transform');
        var translation = (function () {
            if (/translate/.test(transform)) {
                var tmp = /translate\(\s*\d+\s*,\s*\d+\s*\)/.exec(transform);
                return R.map(parseInt, tmp[0].split(/[^\d+]+/).slice(1, 3));
            } else {
                return [0, 0];
            }
        })();
        var rotation = (function () {
            rotateOriginCheck = /rotate\(\s*\d+\s*\)/;
            rotateCheck = /rotate\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/;
            if (rotateOriginCheck.test(transform)) {
                var tmp = rotateOriginCheck.exec(transform);
                return tmp[0].split(/[^\d+]+/)[1];
            } else if (rotateCheck.test(transform)) {
                var tmp = rotateCheck.exec(transform);
                return tmp[0].split(/[^\d+]+/).slice(1, 4);
            } else {
                return [0, translation[0], translation[1]];
            }
        })();
        var scaling = (function () {
            if (/scale/.test(transform)) {
                var tmp = /scale\(\s*\d+\s*\)/.exec(transform);
                return parseInt(tmp[0].split(/[^\d+]+/)[1]);
            } else {
                return 1;
            }
        })();

        return {
            translation: translation,
            rotation: rotation,
            scaling: scaling
        }
    };

    var setTransform = function (elem, scaling, translation, rotation) {

        var translationString = 'translate('+ translation[0] +','+ translation[1] +')';
        var rotationString = 'rotate(';
        var scalingString = 'scale('+ scaling +')';
        if (Array.isArray(rotate)) {
            rotationString += rotation[0] +','+ rotation[1] +',';
            rotationString += rotation[2] + ')';
        } else {
            rotationString += rotation + ')';
        }

        var transformString = translationString + ',';
        transformString += rotationString + ',';
        transformString += scalingString;
        return update(elem, {'transform': transformString});
    };

    var translate = function (elem, translation) {
        var transformation = getTransform(elem);
        var translation = R.zipWith(R.add,
                                    transformation.translation,
                                    translation);
        return setTransform(elem,
                            transformation.scaling,
                            translation,
                            transformation.rotation);
    };

    var rotate = function (elem, rotation) {
        var transformation = getTransform(elem);
        var rotation = rotation;
        return setTransform(elem,
                            transformation.scaling,
                            transformation.translation,
                            rotation);
    };

    var scale = function (elem, scaling) {
        var transformation = getTransform(elem);
        var scaling = scaling * transformation.scaling;
        return setTransform(elem,
                            scaling,
                            transformation.translation,
                            transformation.rotation);
    };

    var setTranslation = function (elem, translation) {
        var transformation = getTransform(elem);
        return setTransform(elem,
                            transformation.scaling,
                            translation,
                            transformation.rotation);
    };

    var setRotation = function (elem, rotation) {
        var transformation = getTransform(elem);
        return setTransform(elem,
                            transformation.scaling,
                            transformation.translation,
                            rotation);
    };

    var setScaling = function (elem, scaling) {
        var transformation = getTransform(elem);
        return setTransform(elem,
                            scaling,
                            transformation.translation,
                            transformation.rotation);
    };

    return {
        create: create,
            update: update,
            inspect: inspectAll,
            line: line,
            polygon: polygon,
            arrow: arrow,
            group: group,
            translate: translate,
            rotate: rotate,
            scale: scale,
            getTransform: getTransform,
            setTranslation: setTranslation
    };
};
