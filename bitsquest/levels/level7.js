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

  var updateDoors = function(world) {
    var bits = [3,6,4,0,2,7,1,5];

    var switch1 = world.findObject('switch1');
    var switch2 = world.findObject('switch2');
    var switch3 = world.findObject('switch3');

    var door1 = world.findObject('door1');
    var door2 = world.findObject('door2');
    var door3 = world.findObject('door3');

    var value = (switch1.isOn ? 1 : 0) +
      (switch2.isOn ? 2 : 0) +
      (switch3.isOn ? 4 : 0);

    var open = bits[value];

    if ((open & 1) === 1) {
      door1.open();
    } else {
      door1.close();
    }

    if ((open & 2) === 2) {
      door2.open();
    } else {
      door2.close();
    }

    if ((open & 4) === 4) {
      door3.open();
    } else {
      door3.close();
    }
  };
  return {
    title: 'bits',
    name: 'level7',
    walls: [
      [0,0,600,10],
      [0,590,260,600],
      [340,590,600,600],
      [0,10,10,260],
      [0,340,10,590],
      [590,10,600,590],

      [250,530,260,570],
      [340,530,350,570],

      [250,470,260,510],
      [340,470,350,510],

      [250,410,260,450],
      [340,410,350,450],

      [250,530,260,570],
      [340,530,350,570],

      [175,50,225,60],
      [275,50,325,60],
      [375,50,425,60],

      [50,175,60,225],
      [540,175,550,225]
    ],
    init: updateDoors,
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
      openTransform: [[1,0,15],[0,1,300],[0,0,1]], 
      closeTransform: [[1,0,15],[0,1,300],[0,0,1]], 
      passable: false,
      invisible: false,
      sealed: true
    },

    { type: Door,
      name: "door1",
      width: 10,
      height: 100,
      closeTransform: [[0,-1,300],[1,0,583],[0,0,1]],
      openTransform: [[0,-1,200],[1,0,578],[0,0,1]],
      isOpen: true
    },
    { type: Door,
      name: "door2",
      width: 10,
      height: 100,
      closeTransform: [[0,-1,300],[1,0,523],[0,0,1]],
      openTransform: [[0,-1,200],[1,0,518],[0,0,1]]
    },
    { type: Door,
      name: "door3",
      width: 10,
      height: 100,
      closeTransform: [[0,-1,300],[1,0,463],[0,0,1]],
      openTransform: [[0,-1,200],[1,0,458],[0,0,1]]
    },
    { type: Switch,
      name: 'switch1',
      width: 50,
      height: 50,
      transform: Box.prototype.translate(200, 200),
      onOn: function() {
        updateDoors.call(this, this.world);
      },
      onOff: function() {
        updateDoors.call(this, this.world);
      }
    },
    { type: Switch,
      name: 'switch2',
      width: 50,
      height: 50,
      transform: Box.prototype.translate(300, 200),
      onOn: function() {
        updateDoors.call(this, this.world);
      },
      onOff: function() {
        updateDoors.call(this, this.world);
      }
    },
    { type: Switch,
      name: 'switch3',
      width: 50,
      height: 50,
      transform: Box.prototype.translate(400, 200),
      onOn: function() {
        updateDoors.call(this, this.world);
      },
      onOff: function() {
        updateDoors.call(this, this.world);
      }
    },
    {
      type: Goal,
      height: 80,
      width: 80,
      transform: [[1,0,300],[0,1,640],[0,0,1]],
      passable: true,
      invisible: true
    }]
  };
});