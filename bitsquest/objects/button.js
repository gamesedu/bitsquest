define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
  "use strict";

  var Button = function() {
    Obj.apply(this, arguments);
    this.invisible = false;
    this.isOn = false;
    this.activated = false;
    this.covered = false;
    this.passable = true;

    this.world.on('tick', this.tick.bind(this));
  };

  Button.prototype = _.defaults({
    onCovered: function(what, world) {
      this.covered = true;
      if (!this.activated) {
        this.activated = true;
        this.isOn = true;
        this.onOn();
      }
    },
    tick: function() {
      if (!this.covered && this.activated) {
        this.isOn = false;
        this.activated = false;
        this.onOff();
      }
      this.covered = false;
    },
    illuminate: function(world) {
      if (this.isOn) {
        world.drawLighting(this.realX, this.realY, '#00e000');
      } else {
        world.drawLighting(this.realX, this.realY, '#e00000');
      }
    },
    draw: function(context) {
      context.beginPath();
      if (this.isOn) {
        context.fillStyle = '#a0c0a0';
        context.strokeStyle = '#809080';
      } else {
        context.fillStyle = '#c0a0a0';
        context.strokeStyle = '#908080';
      }

      context.arc(0, 0, this.hWidth, 0, Math.PI * 2);
      context.fill();
      context.stroke();

      context.beginPath();
      if (this.isOn) {
        context.strokeStyle = '#004000';
        context.fillStyle = '#40ff40';
      } else {
        context.strokeStyle = '#400000';
        context.fillStyle = '#ff4040';
      }
      context.arc(0, 0, this.hWidth - 5, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    }
  }, Obj.prototype);

  return Button;

});