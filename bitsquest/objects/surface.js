define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
  "use strict";

  var Surface = function(parent, transform, name) {
    this.name = name;
    this.transform = transform;
    this.parent = parent;
    this.width = 25;
    this.height = 5;
    this.visible = false;
    this.passable = false;

    this.touching = false;
    this.touched = false;

    Obj.call(this);

    var unit = this._applyTransform(this.transform, 0, 1);
    var center = this._applyTransform(this.transform, 0,0 );
    unit[0] -= center[0];
    unit[1] -= center[1];

    this.surfaceVector = unit;

    parent.addChild(this);
    this._update();
  };

  Surface.prototype = _.defaults({
    onContact: function(object) {
      if (! object.passable) {
        var xDir = this.surfaceVector[0];
        var yDir = this.surfaceVector[1];

        var diffX = (object.realX - (object.boundWidth / 2 * xDir)) - (this.realX + (this.boundWidth / 2 * xDir));
        var diffY = (object.realY - (object.boundHeight / 2 * yDir)) - (this.realY + (this.boundHeight / 2 * yDir));

        diffX = diffX * xDir;
        diffY = diffY * yDir;
        // Good enough contact management.  Anything more and I may as well find a
        // library to do this for me.
        if ((diffX <= 0 && xDir !== 0) || (diffY <= 0 && yDir !== 0)) {
          var parent = object;
          while (parent != undefined && !parent.moveable) {
            parent = parent.parent;
          }
          if (parent && parent.moveable) {
            diffX = diffX * xDir / 2;
            diffY = diffY * yDir / 2;
            this.parent.move(this.parent.xPos + diffX, this.parent.yPos + diffY);
            parent.move(parent.xPos - diffX, parent.yPos - diffY);
          } else {
            this.parent.move(this.parent.xPos + diffX * xDir, this.parent.yPos + diffY * yDir);
          }

          if (! this.touching) {
            if (this.parent && this.parent.trigger) {
              this.parent.trigger('sensor:' + this.name, true);
            }
            this.touching = true;
          }
          this.touched = true;
        }
      }
    }
  }, Obj.prototype);

  return Surface;
});