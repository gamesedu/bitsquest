define([
  'underscore',
  'base/point'
], function (
  _,
  Point
) {

  var Particle = function() {
    Point.apply(this, arguments);
  };

  Particle.prototype = _.defaults({
    width: 0,
    height: 0,
    hHeight: 0,
    hWidth: 0,
    boundWidth: 0,
    boundHeight: 0,

    move: function(x, y) {
      this.transform = this.translate(x, y);
    }
  }, Point.prototype);

  return Particle;
});