define([
  'underscore',
  'base/obj',
  'objects/surface'
], function (
  _,
  Obj,
  Surface
) {
 "use strict";

  var Crate = function() {
    Obj.apply(this, arguments);
    this.invisible = false;
    this.moveable = true;
    this.passable = false;

    var surfaces = [new Surface(this, [[1,0,0], [0,1,17.5], [0,0,1]], 'bottom'),
      new Surface(this, [[-1,0,0], [0,-1,-17.5], [0,0,1]], 'top'),
      new Surface(this, [[0,1,17.5], [-1,0,0], [0,0,1]], 'right'),
      new Surface(this, [[0,-1,-17.5], [1,0,0], [0,0,1]], 'left')];
  };

  Crate.prototype = _.defaults({
    move: function(x, y) {
      this.xPos = x;
      this.yPos = y;
      Obj.prototype.move.call(this, x, y);
    },
    draw: function(context) {
      context.beginPath();
      context.rect(-this.hWidth, -this.hHeight, this.width, this.height);
      context.strokeStyle = '#e0e0e0';
      context.fillStyle = '#d0d0d0';
      context.fill();
      context.stroke();

      context.beginPath();
      context.rect(-this.hWidth + 5, -this.hHeight + 5, this.width - 10, this.height - 10);
      context.strokeStyle = '#b0b0b0';
      context.fillStyle = '#c0c0c0';
      context.fill();
      context.stroke();
    }
  }, Obj.prototype);

  return Crate;
});