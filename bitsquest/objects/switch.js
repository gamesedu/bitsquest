define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
 "use strict";

  var Switch = function() {
    Obj.apply(this, arguments);
    this.invisible = false;
    this.isOn = false;
    this.activated = false;
    this.contact = false;
    this.passable = true;
    this.world.on('tick', this.tick.bind(this));
  };

  Switch.prototype = _.defaults({
    toggle: function(world) {
      this.isOn = !this.isOn;
      if (this.isOn && this.onOn) {
        this.onOn();
      } else if (!this.isOn && this.onOff) {
        this.onOff();
      }
    },
    onCovered: function(what, world) {
      this.activated = true;
      if (this.contact) {
        return;
      }
      this.toggle(world);
      this.contact = true;
    },
    tick: function() {
      if (!this.activated && this.contact) {
        this.contact = false;
      }
      this.activated = false;
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

      context.rect(-this.hWidth, -this.hHeight, this.width, this.height);
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
      context.rect(-this.hWidth + 5, -this.hHeight + 5, this.width - 10, this.height - 10);
      context.fill();
      context.stroke();
    }
  }, Obj.prototype);

  return Switch;
});