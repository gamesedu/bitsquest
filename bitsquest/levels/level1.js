define([
  'base/box',
  'objects/goal',
  'objects/light',
  'objects/door',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Door,
  Robot
) {
  "use strict";

  return {
    title: 'two thrusters',
    name: 'level1',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10, 10,260],
      [0,340,10,590],
      [590,10,600,520]
    ],
    objects: [{ 
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 300,
      code: ''
    },
    {
      type: Door,
      name: "entry",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,300],[0,0,1]],
      closeTransform: [[1,0,15],[0,1,300],[0,0,1]],
      passable: false,
      invisible: false,
      sealed: true
    },
    {
      type: Goal,
      name: "goal",
      width: 80,
      height: 160,
      transform: [[1,0,640],[0,1,560],[0,0,1]]
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(25, 240)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(25, 360)
    },

    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(580, 520)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(500, 550)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(580, 580)
    }
    ]
  };
});