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
    title: 'sensors',
    name: 'level2',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,520],
      [590,10,600,260],
      [590,340,600,590],

      [390,10,400,440]
    ],
    objects: [{
      type: Robot,
      name: 'player',
      xPos: 50,
      yPos: 550,
      code: ''
    },
    {
      type: Door,
      name: "entry",
      width: 10,
      height: 80,
      openTransform: [[1,0,15],[0,1,550],[0,0,1]], //Obj.prototype.translate(580, 205),
      closeTransform: [[1,0,15],[0,1,550],[0,0,1]], //Obj.prototype.translate(585, 300),
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
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(360, 475)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(430, 425)
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
      transform: Box.prototype.translate(80, 500)
    },
    { 
      type: Light,
      width: 10,
      height: 10,
      transform: Box.prototype.translate(80, 580)
    }
    ]
  };
});
