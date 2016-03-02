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
    title: 'range finding',
    name: 'level6',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,120],
      [0,200,10,590],
      [590,10,600,460],
      [590,540,600,590]
    ],
    objects: [
      {
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 160,
      code: ''
    },
    { type: Door,
      name: "obstacle",
      width: 10,
      height: 100,
      openTransform: [[-1,0,580],[0,-1,405],[0,0,1]], 
      closeTransform: [[-1,0,585],[0,-1,500],[0,0,1]],
      passable: false,
      invisible: false
    },
    {
      type: Door,
      name: "entry",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,160],[0,0,1]], //Obj.prototype.translate(580, 205),
      closeTransform: [[1,0,15],[0,1,160],[0,0,1]], //Obj.prototype.translate(585, 300),
      passable: false,
      invisible: false,
      sealed: true
    },
    { type: Switch,
      name: Switch,
      width: 50,
      height: 50,
      transform: Box.prototype.translate(300, 400),
      onOn: function() {
        var object = this.world.findObject('obstacle');
        object.open();
      },
      onOff: function() {
        var object = this.world.findObject('obstacle');
        object.close();
      }
    },
    { type: ForceField,
      name: 'field',
      width: 250,
      height: 25,
      transform: Box.prototype.translate(135, 250)
    },
    { type: ForceField,
      name: 'field',
      width: 250,
      height: 25,
      transform: Box.prototype.translate(465, 250)
    },
    {
      type: Goal,
      name: "goal",
      width: 80,
      height: 160,
      transform: [[1,0,640],[0,1,500],[0,0,1]]
    }]
  };
});