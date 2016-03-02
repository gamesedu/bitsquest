define([
  'underscore',
  'robot/component',
  'base/obj',
  'base/box',
  'base/particle'
], function (
  _,
  Component,
  Obj,
  Box,
  Particle
) {
  "use strict";

  var Shell = function() {
    Particle.apply(this, arguments);
  };

  Shell.prototype = _.defaults({
    dX: 0,
    dY: 0,
    name: 'shell',

    tick: function(world) {
      var i;
      this.x = this.x + this.dX;
      this.y = this.y + this.dY;
      this.realX = this.x;
      this.realY = this.y;

      var objects = world.objects.intersects(this, false);
      if (objects.length > 0) {
        for (i = 0; i < objects.length; i++) {
          var parent = objects[i];
          while (parent !== undefined) {
            if (parent.hit) {
              parent.hit(this);
              break;
            }
            parent = parent.parent;
          }
        }
        world.removeParticle(this);
      }
    },

    render: function(context) {
      context.beginPath();
      context.strokeStyle='#800000';
      context.arc(this.x, this.y, 5, 0, Math.PI*2);
      context.stroke();
    }
  }, Particle.prototype);


  var Cannon = Component.extend({
    constructor: function Cannon() {
       Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function() {
      this.name = 'cannon';

      this.angle = 0;
      this.cooldown = 5;

      this.robot = this.get('robot');

      this.on('robot:tick', this.tick.bind(this));
      this.on('cannon:set-angle', this.setAngle.bind(this));
      this.on('cannon:fire', this.fire.bind(this));
    },
    inputEvents: ['robot:tick', 'cannon:set-angle', 'cannon:fire'],
    outputEvents: ['cannon:angle', 'cannon:fired', 'cannon:ready'],


    setAngle: function(angle) {
      if (angle !== undefined) {
       this.angle = angle;
      }
      this.trigger('cannon:angle', this.angle);
    },
    fire: function() {
      if (this.cooldown === 0) {
        var a = this.angle / 180 * Math.PI;
        var dX = Math.cos(a);
        var dY = Math.sin(a);
        var shell = new Shell({ x: this.robot.realX + 21 * dX, y: this.robot.realY + 21 * dY, dX: dX * 5, dY: dY * 5 });
        this.robot.world.addParticle(shell);
        this.cooldown = 10;
        this.trigger('cannon:fired', this.angle);
      }
    },
    tick: function() {
      if (this.cooldown > 0) {
        this.cooldown --;
        if (!this.cooldown) {
          this.trigger('cannon:ready', true);
        }
      }
    },
    draw: function() {}
  });

  return Cannon;

});