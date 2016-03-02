define([
  'underscore',
  'base/box'
], function (
  _,
  Box
) {
 "use strict";

  var Light = function() {
    Box.apply(this, arguments);
    this.invisible = false;
    this.passable = true;
    this.timer = 0;
    this.isOn = this.isOn === undefined ? true : this.isOn;

    this.world.on('tick', this.tick.bind(this));
  };

  Light.prototype = _.defaults({
    illuminate: function(world) {
      if (this.isOn) {
        world.drawLighting(this.realX, this.realY, '#405050');
      }
    },
    setOn: function(on) {
      if (on !== this.isOn) {
        this.isOn = on;
      }
    },
    draw: function(context) {
    },
    tick: function() {
      if (this.strobe) {
        if (this.strobePos !== undefined) {
          this.setOn(this.timer % this.strobe === this.strobePos);
        } else {
          this.setOn(this.timer % this.strobe === 0);
        }
        this.timer++;
      }
    }
  }, Box.prototype);

  return Light;

});