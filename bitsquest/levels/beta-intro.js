define([
  'base/box',
  'objects/goal',
  'objects/light',
  'objects/door',
  'objects/switch',
  'objects/forcefield',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Door,
  Switch,
  ForceField,
  Robot
) {
  "use strict";

  return {
    title: 'helper bot',
    name: 'beta-intro',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,460],
      [0,540,10,590],
      [590,10,600,260],
      [590,340,600,590],

      [10,270,100,260],
      [90,260,100,10]
    ],
    objects: [{
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 500,
      code: ''
    },
    {
      type: Robot,
      xPos: 50,
      yPos: 130,
      name: 'beta',
      color: '#40f040',
      code: 'this.on("start", function() { this.thrusters.top(true); });' +
        'this.on("sensor:bottom", function(c) { if (c) { this.thrusters.top(!c); this.thrusters.bottom(c); }});' +
        'this.on("sensor:top", function(c) { if (c) {this.thrusters.top(c); this.thrusters.bottom(!c); }})'
    },
     {
      type: Door,
      name: "entry",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,500],[0,0,1]], //Obj.prototype.translate(580, 205),
      closeTransform: [[1,0,15],[0,1,500],[0,0,1]], //Obj.prototype.translate(585, 300),
      passable: false,
      invisible: false,
      sealed: true
    },

    {
      type: Switch,
      transform: [[1,0,50],[0,1,200],[0,0,1]],
      name: 'switch1',
      width: 40,
      height: 40,
      onOn: function() {
        var field = this.world.findObject('ff2');
        field.isOn = false;
        field.passable = true;
      },
      onOff: function() {
        var field = this.world.findObject('ff2');
        field.isOn = true;
        field.passable = false;
      }
    },
    {
      type: Switch,
      transform: [[1,0,50],[0,1,70],[0,0,1]],
      name: 'switch1',
      width: 40,
      height: 40,
      onOn: function() {
        var field = this.world.findObject('ff1');
        field.isOn = false;
        field.passable = true;
      },
      onOff: function() {
        var field = this.world.findObject('ff1');
        field.isOn = true;
        field.passable = false;
      }
    },
    {
      name: 'ff1',
      type: ForceField,
      width: 200,
      height: 20,
      transform: [[0,-1, 550],[1,0,300],[0,0,1]]
    },
    {
      name: 'ff2',
      type: ForceField,
      width: 200,
      height: 20,
      transform: [[0,-1,450],[1,0,300],[0,0,1]]
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
