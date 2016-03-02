define([
  'base/box',
  'objects/goal',
  'objects/light',
  'objects/door',
  'objects/switch',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Door,
  Switch,
  Robot
) {
  "use strict";

  return {
    title: 'going up',
    name: 'level3',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,260],
      [0,340,10,590],
      [590,10,600,590],

      [300,260,340,270],
      [350,260,340,350],
      [350,350,250,360],
      [250,150,240,360],
      [440,150,250,160],
      [450,150,440,450],
      [450,450,150,460],
      [150,60,140,460],
      [540,50,140,60],
      [550,50,540,550],
      [550,550,30,560],

      [20,340,30,560],
      [10,340,20,350],

      [140,250,10,260]

    ],
    objects: [
      {
      type: Robot,
      name: 'player',
      xPos: 60,
      yPos: 300,
      code: ''
    },
    {
      type: Door,
      name: 'elevator',
      width: 10,
      height: 50,
      closeTransform: [[0,-1,275],[1,0,265],[0,0,1]],
      openTransform: [[0,-1,320],[1,0,250],[0,0,1]],
      passable: false,
      visible: true
    },
    {   
      type: Door,
      name: "entry",
      width: 10,
      height: 80,
      openTransform: [[1,0,15],[0,1,300],[0,0,1]],
      closeTransform: [[1,0,15],[0,1,300],[0,0,1]], 
      passable: false,
      invisible: false,
      sealed: true
    },
    {
      type: Switch,
      width: 80,
      height: 20,
      transform: [[1,0,395],[0,1,290],[0,0,1]],
      onOn: function() {
        this.world.findObject('elevator').open();
      },
      onOff: function() {
        this.world.findObject('elevator').close();
      }
    },
    {
      type: Switch,
      width: 40,
      height: 40,
      transform: [[1,0,320],[0,1,290],[0,0,1]],
      onOn: function() {
        var world = this.world;
        setTimeout(world.win.bind(world), 5);
      }
    }
    ]
  };
});