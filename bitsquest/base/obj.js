define([
  'underscore',
  'base/box'
], function (
  _,
  Box
) {

  var Obj = function() {
    this.init.apply(this, arguments);
    if (this.xPos !== undefined && this.yPos !== undefined) {
      this.transform = this.translate(this.xPos, this.yPos);
    }
    this._update();
    this.interactive = this.interactive || (this.interactive === undefined);

    var pos = this._applyTransform(this.transform, 0, 0);
    this.xPos = pos[0];
    this.yPos = pos[1];
  };
  Obj.prototype = _.defaults({
    passabled: true,
    move: function(x, y) {
      this.transform = this.translate(x, y);
      this._update();
    },
    draw: function(context) {
      context.beginPath();
      context.rect(-this.hWidth, -this.hHeight, this.width, this.height);
      context.strokeStyle = '#1010f0';
      context.fillStyle = '#1010f0';
      context.fill();
      context.stroke();
    }
  }, Box.prototype);

  return Obj;
});