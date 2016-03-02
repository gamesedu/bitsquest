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
    title: 'switches',
    name: 'level5',
    walls: [
      [0,0,600,10],
      [0,590,600,600],

      [0,10,10,260],
      [0,340,10,590],

      [590,10,600,120],
      [590,200,600,590]
    ],
    objects: [
      {
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 300,
      code: ''
    },
    {
      type: Door,
      name: "obstacle",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,300],[0,0,1]], //Obj.prototype.translate(580, 205),
      closeTransform: [[1,0,15],[0,1,300],[0,0,1]], //Obj.prototype.translate(585, 300),
      passable: false,
      invisible: false,
      sealed: true
    },
    {
      type: Door,
      name: "obstacle",
      width: 10,
      height: 100,
      openTransform: [[-1,0,580],[0,-1,65],[0,0,1]], //Obj.prototype.translate(580, 205),
      closeTransform: [[-1,0,585],[0,-1,160],[0,0,1]], //Obj.prototype.translate(585, 300),
      passable: false,
      invisible: false
    },
    { 
      type: Switch,
      name: Switch,
      width: 50,
      height: 50,
      transform: Box.prototype.translate(300, 550),
      onOn: function() {
        var object = this.world.findObject('obstacle');
        object.open();
      },
      onOff: function() {
        var object = this.world.findObject('obstacle');
        object.close();
      }
    },
    {
      type: Goal,
      name: "goal",
      width: 80,
      height: 160,
      transform: [[1,0,640],[0,1,160],[0,0,1]]
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(570, 110)
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(520, 160)
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(570, 210)
    }
    ]
  };
});