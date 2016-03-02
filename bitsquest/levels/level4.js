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
    title: 'state',
    name: 'level4',
    walls: [
      [0,0,600,10],
      [0,590,600,600],

      [0,10,10,120],
      [0,200,10,590],

      [400,100,500,500],
      [590,10,600,260],
      [590,340,600,590]

    ],
    objects: [
      {
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 160,
      code: ''
    },
    {
      type: Door,
      name: "obstacle",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,160],[0,0,1]],
      closeTransform: [[1,0,15],[0,1,160],[0,0,1]], 
      passable: false,
      invisible: false,
      sealed: true
    },
    {
      type: Goal,
      name: "goal",
      width: 80,
      height: 160,
      transform: [[1,0,640],[0,1,300],[0,0,1]]
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(550, 400)
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(550, 200)
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(350, 400)
    },
    { type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(350, 200)
    }
    ]
  };
});
