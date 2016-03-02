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
    title: 'danger maze',
    name: 'radar-maze',
    walls: [
      [0,0,260,10],
      [340,0,600,10],
      [0,590,600,600],
      [0,10,10,590],
      [590,10,600,360],
      [590,440,600,590]
    ],
    objects: [
      {
      type:Door,
      name:"entry",
      height:80,
      width:20,
      closeTransform:[[0,1,300],[-1,0,0],[0,0,1]],
      openTransform:[[0,-1,300],[1,0,0],[0,0,1]],
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
    },
    {
      type: ForceField,
      width: 60,
      height: 20,
      transform: [[1,0,310],[0,1,480],[0,0,1]]
    },
    {
      type: ForceField,
      width: 160,
      height: 20,
      transform: [[1,0,510],[0,1,490],[0,0,1]]
    },
    {
      type: ForceField,
      width: 200,
      height: 20,
      transform: [[1,0,110],[0,1,450],[0,0,1]]
    },
    {
      type: ForceField,
      width: 180,
      height: 20,
      transform: [[1,0,450],[0,1,210],[0,0,1]]
    },
    {
      type: ForceField,
      width: 260,
      height: 20,
      transform: [[1,0,230],[0,1,120],[0,0,1]]
    },
    {
      type: ForceField,
      width: 380,
      height: 20,
      transform: [[1,0,400],[0,1,350],[0,0,1]]
    },
    {
      type: ForceField,
      width: 140,
      height: 20,
      transform: [[1,0,80],[0,1,350],[0,0,1]]
    },


    {
      type: ForceField,
      width: 210,
      height: 20,
      transform: [[0,-1,110],[1,0,235],[0,0,1]]
    },
    {
      type: ForceField,
      width: 130,
      height: 20,
      transform: [[0,-1,240],[1,0,275],[0,0,1]]
    },
    {
      type: ForceField,
      width: 40,
      height: 20,
      transform: [[0,-1,350],[1,0,30],[0,0,1]]
    },
    {
      type: ForceField,
      width: 100,
      height: 20,
      transform: [[0,-1,350],[1,0,180],[0,0,1]]
    },
    {
      type: ForceField,
      width: 30,
      height: 20,
      transform: [[0,-1,350],[1,0,325],[0,0,1]]
    },
    {
      type: ForceField,
      width: 130,
      height: 20,
      transform: [[0,-1,350],[1,0,425],[0,0,1]]
    },
    {
      type: ForceField,
      width: 30,
      height: 20,
      transform: [[0,-1,350],[1,0,575],[0,0,1]]
    },
    {
      type: ForceField,
      width: 80,
      height: 20,
      transform: [[0,-1,200],[1,0,500],[0,0,1]]
    },
    {
      type: ForceField,
      width: 80,
      height: 20,
      transform: [[0,-1,460],[1,0,160],[0,0,1]]
    }
    ]
  };
});