define([
  'underscore',
  'robot/component'
], function (
  _,
  Component
) {
  "use strict";

  var Radar = Component.extend({
    constructor: function Radar() {
       Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function() {
      this.name = 'radar';
      this.robot = this.get('robot');
      this.active = false;
      this.hit = false;
      this.angle = 0;
      this.stack = [];
      this.drawStack = [];

    //  this.on('robot:tick', this.tick.bind(this));
   //   this.on('radar:fire', this.fire.bind(this));
    },
    inputEvents: ['robot:tick', 'radar:fire'],
    outputEvents: ['radar:hit', 'radar:miss'],


    draw: function(context) {
      var ds = this.drawStack;
      if (ds.length > 0) {
        var overlay = this.robot.world.contexts.overlay;
        overlay.beginPath();
        overlay.strokeStyle = 'rgba(255,80,80,0.5)';
        overlay.lineWidth = 3;
        while (ds.length > 0) {
          var active = ds.shift();
          var intercept = active.intercept;
          var x = intercept.x - this.robot.realX;
          var y = intercept.y - this.robot.realY;
          overlay.moveTo(this.robot.realX, this.robot.realY);
          overlay.lineTo(intercept.x, intercept.y);
        }
        overlay.stroke();
      }
    },
    fire: function(angle) {
      this.stack.push({ angle: angle });
    },
    calculate: function(angle) {
      var a = angle / 180 * Math.PI;
      var dX = Math.cos(a);
      var dY = Math.sin(a);

      var ray = { p1: { x: this.robot.realX + dX * 20, y: this.robot.realY + dY * 20 }, p2: {x: this.robot.realX + dX * 21, y: this.robot.realY + dY * 21 }};

      return this.robot.world.nearest(ray, [this.robot]);
    },
    tick: function() {

      if (this.stack.length > 0) {
        var active = this.stack[0];
        if (active.response === undefined) {
          var nearest = this.calculate(active.angle);
          if (nearest) {
            active.distance = Math.sqrt(nearest.d);
            active.intercept = nearest.i;
            active.response = Math.min(active.distance >> 7, 5);
            this.drawStack.push(active);
          } else {
            active.response = 5;
          }
        } else {
          if (active.response <= 0) {
            if (active.distance == undefined) {
              this.trigger('radar:miss', active.angle);
            } else {
              this.trigger('radar:hit', active.angle, active.distance);
            }
            this.stack.shift();
          } else {
            active.response--;
          }
        }
      }
    }
  });

  return Radar;


});