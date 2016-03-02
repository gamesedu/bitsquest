define([
  'base/box',
  'objects/goal',
  'objects/light',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Robot
) {
  "use strict";

  return {
    title: 'introduction',
    name: 'level0',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,590],
      [590,10,600,260],
      [590,340,600,590]
    ],
    objects: [{
      type: Robot,
      name: 'player',
      xPos: 200,
      yPos: 300,
      code: ''
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