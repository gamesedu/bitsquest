define([
  'base/box',
  'objects/goal',
  'objects/light',
  'objects/door',
  'objects/forcefield',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Door,
  ForceField,
  Robot
) {
  "use strict";

  return {
    name: 'robot-duel',
    title: 'Exterminate.',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,590],
      [590,10,600,590]
    ],
    init: function(world) {
      world.findObject('beta').move(30, ((Math.random() * 500)|0) + 50);
    },
    objects: [{
      type: Robot,
      color: '#40f040',
      name: 'player',
      xPos: 300,
      yPos: 300,
      code: '',
      hit: function(what) {
        this.world.lose();
      }
    },
    {
      type: Robot,
      xPos: 30,
      yPos: 200,
      name: 'beta',
      color: '#f04040',
      code: 'var angle = 0;' +
        'this.on("start", function() { this.radar.angle(0); this.radar.ping(); });' +
        'this.on("sensor:bottom", function(c) { this.thrusters.left(c); if(c) { angle = 270; }});' +
        'this.on("sensor:left", function(c) { this.thrusters.top(c); if(c) { angle = 0;  }});' +
        'this.on("sensor:top", function(c) { this.thrusters.right(c); if(c) { angle = 90;  }});' +
        'this.on("sensor:right", function(c) { this.thrusters.bottom(c); if(c) { angle = 180;  }});' +
        'this.on("radar:hit", function(a, distance) { if (distance < 540) { this.cannon.aim(a); this.cannon.fire(); }; this.radar.angle(angle); this.radar.ping(); });' +
        ' ',
      hit: function(what) {
        this.world.win();
      }
    },
    {
      type: Goal,
      name: "goal",
      width: 80,
      height: 80,
      transform: [[1,0,640],[0,1,300],[0,0,1]]
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(100, 300)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(300, 300)
    },
    {
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(580, 250)
    },
    {
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(580, 350)
    },
    {
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(400, 300)
    },
    {
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(500, 300)
    }
    ]
  };
});
