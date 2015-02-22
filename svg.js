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
        return create('line', R.mixin(props, attrs));
    };


    var polygon = function(points, attrs) {
        var pointString = R.reduce(function (a, b) { return a + b; }, '',
                R.map(function (point) {
                    return point[0] + ', ' + point[1] + ' ';
                }, points));
        var props = {'points': pointString};
        return create('polygon', R.mixin(props, attrs))
    };


    var group = function (elems, attrs) {;
        var g = create('g', attrs)
            R.map(function (e) { g.appendChild(e); }, elems);
        return g;
    };


    var transformGroup = function (group, scale, translate, rotate) {
        return update(group, {'transform':
            'translate(' + translate[0] + ', ' + translate[1] + '), rotate(' + 180 * rotate / Math.PI + '), scale(' + scale + ')'});
            };

            var arrow = function (position, vector, attrs) {

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


            return {
                create: create,
                update: update,
                inspect: inspectAll,
                line: line,
                polygon: polygon,
                arrow: arrow,
                group: group,
                transformGroup: transformGroup
            };
};
