define([
  'underscore',
  'base/shape'
], function (
  _,
  Shape
) {


  var Point = function() {
    this.init.apply(this, arguments);
    this.x = this.x || 0;
    this.y = this.y || 0;
  };

  Point.prototype = _.defaults({
  }, Shape.prototype);

  return Point;
});