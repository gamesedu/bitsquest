define([
  'underscore',
  'base/model'
], function (
  _,
  Model
) {

  var Shape = function() {
  };

  Shape.prototype = _.defaults({
    transform: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    _applyTransform: function(t, x, y) {
      return [
        x * t[0][0] + y * t[0][1] + t[0][2],
        x * t[1][0] + y * t[1][1] + t[1][2]];
    },
    _multiplyTransforms: function(p, t) {
      return [
        [ p[0][0] * t[0][0] + p[0][1] * t[1][0] + p[0][2] * t[2][0],
          p[0][0] * t[0][1] + p[0][1] * t[1][1] + p[0][2] * t[2][1],
          p[0][0] * t[0][2] + p[0][1] * t[1][2] + p[0][2] * t[2][2]],
        [ p[1][0] * t[0][0] + p[1][1] * t[1][0] + p[1][2] * t[2][0],
          p[1][0] * t[0][1] + p[1][1] * t[1][1] + p[1][2] * t[2][1],
          p[1][0] * t[0][2] + p[1][1] * t[1][2] + p[1][2] * t[2][2]],
        [ p[2][0] * t[0][0] + p[2][1] * t[2][0] + p[2][2] * t[2][0],
          p[2][0] * t[0][1] + p[2][1] * t[2][1] + p[2][2] * t[2][1],
          p[2][0] * t[0][2] + p[2][1] * t[2][2] + p[2][2] * t[2][2]]
      ];
    },

    translate: function(x, y) {
      return [[1, 0, x], [0, 1, y], [0, 0, 1]];
    }
  }, Model);

  return Shape;
});