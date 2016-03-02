define([
  'jquery',
  'underscore',
  'robot/component'
], function (
  $,
  _,
  Component
) {
  "use strict";

  var Thrusters = Component.extend({
    constructor: function Thrusters() {
       Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    invisible: false,
    left: false,
    right: false,
    top: false,
    bottom: false,

    initialize: function() {
      this.set('name', 'thrusters');
      this.name = 'thrusters';
      this.frame = 0;

      var robot = this.get('robot');
      this.robot = robot;

      this.on('robot:tick', this.tick.bind(this));
      this.on('thrusters:start', this.start.bind(this));
      this.on('thrusters:stop', this.stop.bind(this));
    },
    inputEvents: ['robot:tick', 'thrusters:start', 'thrusters:stop'],
    outputEvents: ['robot:accelerate', 'thrusters:on', 'thrusters:off'],


    start: function(thruster) {
      this[thruster] = true;
      this.trigger('thrusters:on', thruster);
    },
    stop: function(thruster) {
      this[thruster] = false;
      this.trigger('thrusters:off', thruster);
    },
    tick: function() {
      var velocityX = this.left - this.right;
      var velocityY = this.top - this.bottom;
      var power = 2;

      this.trigger('robot:accelerate', velocityX * power, velocityY * power)
      this.frame++;
    },

    _drawThruster: function(context) {
      context.save();
      context.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 20; i++) {
        context.fillStyle = "rgba(" + "180, 160, 20,"+ i/20+")";
        context.strokeStyle = "rgba(" + "180, 80, 20," +  i/20 + ")";
        for (var j = 0; j < i; j++) {
          var x = -40 + i;
          var w = i < 15 ? i * 1.1 : (20 - i) * 3 + 3;
          var y = j / i * w - w / 2;
          var x1 = (x - Math.random() * 6)|0;
          var y1 = (y + Math.random() * 4 -2)|0;
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo((x - Math.random() * 6)|0, (y + Math.random() * 4 - 2)|0);
          context.lineTo((x - Math.random() * 6)|0, (y + Math.random() * 4 - 2)|0);
          context.lineTo(x1, y1);
          context.fill();
          context.stroke();
        }
      }
      context.restore();
    },
    illuminate: function(world) {
      if (this.left) {
        world.drawLighting(this.robot.realX -30, this.robot.realY, '#806010');
      }
      if (this.right) {
        world.drawLighting(this.robot.realX + 30, this.robot.realY, '#806010');
      }
      if (this.top) {
        world.drawLighting(this.robot.realX, this.robot.realY - 30, '#806010');
      }
      if (this.bottom) {
        world.drawLighting(this.robot.realX, this.robot.realY + 30, '#806010');
      }
    },
    draw: function(context) {
      var world = this.robot.world;
      var overlay = world.contexts.overlay;
      var which = (this.frame % 10);

      if (this.left) {
        overlay.drawImage(Thrusters.imageData.left[which], this.robot.realX - 51.5, this.robot.realY - 20.5);
      }
      if (this.right) {
        overlay.drawImage(Thrusters.imageData.right[which], this.robot.realX + 12.5, this.robot.realY - 20.5);
      }
      if (this.top) {
        overlay.drawImage(Thrusters.imageData.top[which], this.robot.realX - 20.5, this.robot.realY - 51.5);
      }
      if (this.bottom) {
        overlay.drawImage(Thrusters.imageData.bottom[which], this.robot.realX - 20.5, this.robot.realY + 12.5);
      }
    }
  });


  $(document).ready( function() {
    var thrusters = {
      left: [],
      right: [],
      top: [],
      bottom: []
    };

    var variations;
    for (var l = 0; l < 4; l ++) {
      switch(l) {
        case 0:
          variations = thrusters['left'];
        break;
        case 1:
          variations = thrusters['bottom'];
        break;
        case 2:
          variations = thrusters['top'];
        break;
        case 3:
          variations = thrusters['right'];
        break;
      }

      for (var k = 0; k < 10; k++) {
        var canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;

        variations.push(canvas);

        var context = canvas.getContext('2d');
        context.clearRect(0,0,39,39);
        context.lineWidth = 2.0;
        context.globalCompositeOperation = 'lighter';

        switch (l) {
          case 0:
            context.setTransform(1,0,0,1,20.5,20.5);
          break;
          case 1:
            context.setTransform(0,-1,1,0,20.5,20.5);
          break;
          case 2:
            context.setTransform(0,1,-1,0,20.5,20.5);
          break;
          case 3:
            context.setTransform(-1,0,0,-1,20.5,20.5);
        }
        for (var i = 0; i < 20; i++) {
          context.fillStyle = "rgba(" + "180, 160, 20,"+ i/20+")";
          context.strokeStyle = "rgba(" + "180, 80, 20," +  i/20 + ")";
          for (var j = 0; j < i; j++) {
            var x = i - 7;
            var w = i < 15 ? i * 1.1 : (20 - i) * 3 + 3;
            var y = j / i * w - w / 2;
            var x1 = (x - Math.random() * 6)|0;
            var y1 = (y + Math.random() * 4 -2)|0;
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo((x - Math.random() * 6)|0, (y + Math.random() * 4 - 2)|0);
            context.lineTo((x - Math.random() * 6)|0, (y + Math.random() * 4 - 2)|0);
            context.lineTo(x1, y1);
            context.fill();
            context.stroke();
          }
        }
      }
    }
    Thrusters.imageData = thrusters;
  });



  return Thrusters;

});