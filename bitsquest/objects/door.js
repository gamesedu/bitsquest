define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
  "use strict";

  var Door = function() {
    Obj.apply(this, arguments);
    this.invisible = false;
    this.isOpen = this.isOpen === undefined ? false : this.isOpen;
    this.passable = false;
    this.transform = this.isOpen ? this.openTransform : this.closeTransform;

    this._calculateRealTransform();
    this._update();
  };

  Door.prototype = _.defaults({
    draw: function(context) {
      context.beginPath();
      context.fillStyle = '#a0a0a0';
      context.fillStyle = '#808080';
      context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
      context.stroke();
      context.fill();

      var overlay = this.world.contexts.overlay;
      overlay.save();
      overlay.transform(this.realTransform[0][0], this.realTransform[0][1], this.realTransform[1][0], this.realTransform[1][1], this.realTransform[0][2], this.realTransform[1][2]);

      if (this.sealed) {
        overlay.fillStyle = '#f0f0f0';
      } else if (this.isOpen) {
        overlay.fillStyle = '#10f010';
      } else {
        overlay.fillStyle = '#f01010';
      }

      overlay.beginPath();
      overlay.moveTo(-this.hWidth, -this.hHeight + 2);
      overlay.lineTo(this.hWidth, -this.hHeight + 3);
      overlay.lineTo(this.hWidth, -this.hHeight + 5);
      overlay.lineTo(-this.hWidth, -this.hHeight + 4);
      overlay.lineTo(-this.hWidth, -this.hHeight + 2);
      overlay.fill();

      overlay.beginPath();
      overlay.moveTo(-this.hWidth, -this.hHeight + 7);
      overlay.lineTo(this.hWidth, -this.hHeight + 8);
      overlay.lineTo(this.hWidth, -this.hHeight + 10);
      overlay.lineTo(-this.hWidth, -this.hHeight + 9);
      overlay.lineTo(-this.hWidth, -this.hHeight + 7);
      overlay.fill();

      overlay.beginPath();
      overlay.moveTo(-this.hWidth, this.hHeight - 2);
      overlay.lineTo(this.hWidth, this.hHeight - 3);
      overlay.lineTo(this.hWidth, this.hHeight - 5);
      overlay.lineTo(-this.hWidth, this.hHeight - 4);
      overlay.lineTo(-this.hWidth, this.hHeight - 2);
      overlay.fill();

      overlay.beginPath();
      overlay.moveTo(-this.hWidth, this.hHeight - 7);
      overlay.lineTo(this.hWidth, this.hHeight - 8);
      overlay.lineTo(this.hWidth, this.hHeight - 10);
      overlay.lineTo(-this.hWidth, this.hHeight - 9);
      overlay.lineTo(-this.hWidth, this.hHeight - 7);
      overlay.fill();

      overlay.restore();
    },

    open: function() {
      this.isOpen = true;
      this.transform = this.openTransform;
      this._calculateRealTransform();
      this._update();
    },

    close: function() {
      this.isOpen = false;
      this.transform = this.closeTransform;
      this._calculateRealTransform();
      this._update();
    }}, Obj.prototype);

  return Door;

});