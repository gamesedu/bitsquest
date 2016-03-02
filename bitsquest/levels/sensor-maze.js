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
    title: 'maze',
    name: 'sensor-maze',
    walls: [
      [0,0,260,10],
      [340,0,600,10],
      [0,590,600,600],
      [0,10,10,590],
      [590,10,600,360],
      [590,440,600,590],

      [340,10,350,50],
      [340,110,350,250],
      [340,310,350,350],

      [340,360,350,500],
      [340,560,350,590],

      [10,350,150,360],
      [210,350,590,360],

      [110,110,340,120],
      [350,210,540,220],

      [460,110,470,210],
      [110,120,120,350],
      [240,200,250,350],
      [190,460,200,540],

      [10,450,200,460],
      [420,490,590,500],
      [260,490,340,500]

    ],
    objects: [  {
      type:Door,
      name:"entry",
      height:80,
      width:20,
      closeTransform:[[0,1,300],[-1,0,0],[0,0,1]],
      openTransform: [[0,-1,300],[1,0,0],[0,0,1]],
      sealed:true
    },
    {
      type: Robot,
      name: 'player',
      xPos: 300,
      yPos: 40,
      code: ''
    },
    {
      type: Goal,
      name: "goal",
      width: 100,
      height: 100,
      transform: [[1,0,640],[0,1,400],[0,0,1]]
    }]
  };
});