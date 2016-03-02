define([
  'base/box',
  'objects/goal',
  'objects/light',
  'objects/door',
  'objects/button',
  'objects/crate',
  'robot/robot'
], function(
  Box,
  Goal,
  Light,
  Door,
  Button,
  Crate,
  Robot
) {
  "use strict";

  return {
    title: 'sokoban',
    name: 'sokoban',
    walls: [
      [0,0,600,10],
      [0,590,600,600],

      [0,10,10,260],
      [0,340,10,590],

      [590,10,600,120],
      [590,200,600,590],

      [200,10,230,40],
      [130,400,160,430],
      [500,285,530,315],
      [350,395,380,425],
      [470,560,500,590],
      [560,370,590,400],
      [400,120,430,150]
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
      name: "entry",
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
      type: Goal,
      name: "goal",
      width: 80,
      height: 160,
      transform: [[1,0,640],[0,1,150],[0,0,1]]
    },
    {
      type: Crate,
      name: 'crate',
      width: 60,
      height: 60,
      transform: [[1,0,470],[0,1,450],[0,0,1]]
    },
    {
      type: Crate,
      name: 'crate',
      width: 60,
      height: 60,
      transform: [[1,0,200],[0,1,300],[0,0,1]]
    },
    { 
      type: Button,
      name: 'switch1',
      width: 40,
      height: 40,
      transform: Box.prototype.translate(200, 450),
      onOn: function() {
        var other = this.world.findObject('switch2');
        if (other.isOn) {
          var object = this.world.findObject('obstacle');
          object.open();
        }
      },
      onOff: function() {
        var object = this.world.findObject('obstacle');
        object.close();
      }
    },
    { 
      type: Button,
      name: 'switch2',
      width: 40,
      height: 40,
      transform: Box.prototype.translate(460, 100),
      onOn: function() {
        var other = this.world.findObject('switch1');
        if (other.isOn) {
          var object = this.world.findObject('obstacle');
          object.open();
        }
      },
      onOff: function() {
        var object = this.world.findObject('obstacle');
        object.close();
      }
    }
    ]
  };
});