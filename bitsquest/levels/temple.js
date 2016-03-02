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
    title: 'Temple of the Dragon',
    name: 'temple',
    walls: [
      [0,0,600,10],
      [0,590,600,600],
      [0,10,10,360],
      [0,440,10,590],
      [590,10,600,590],

      [200,200,210,400],
      [200,200,210,400],
      [200,400,230,410],
      [370,400,400,410],
      [390,200,400,400],

      [250,80,350,90],
      [240,80,250,190],
      [350,80,360,190]
    ],
    objects: [{
      type: Robot,
      color: '#40f040',
      name: 'player',
      xPos: 50,
      yPos: 400,
      code: '',
      hit: function(what) {
        this.world.lose();
      }
    },
    {
      type: Robot,
      xPos: 300,
      yPos: 160,
      name: 'beta',
      color: '#f04040',
      code: 'var previous; this.on("start", function() { this.thrusters.right(true); this.radar.angle(90); this.cannon.aim(90); this.radar.ping() });' +
        'this.on("sensor:left", function(c) { if (c) { this.thrusters.left(c); this.thrusters.right(!c); }});' +
        'this.on("sensor:right", function(c) { if (c) { this.thrusters.right(c); this.thrusters.left(!c); }});' +
        'this.on("radar:hit", function(angle, distance) { if (previous !== distance && this.cannon.ready()) { previous = distance; this.cannon.fire();  }; this.radar.ping(); });  ',
      hit: function(what) {
        this.parentBox.removeChild(this);
        this.world.removeObject(this);
      }
    },
    {
      type: Door,
      name: "entry",
      width: 10,
      height: 100,
      openTransform: [[1,0,15],[0,1,400],[0,0,1]], 
      closeTransform: [[1,0,15],[0,1,400],[0,0,1]], 
      passable: false,
      invisible: false,
      sealed: true
    },
    {
      type: Switch,
      width: 80,
      height: 20,
      transform: [[1,0,300],[0,1,410],[0,0,1]],
      onOn: function() {
        this.world.findObject('elevator1').open();
        this.world.findObject('elevator2').open();
      },
      onOff: function() {
        this.world.findObject('elevator1').close();
        this.world.findObject('elevator2').close();
      }
    },
     {
      type: Door,
      name: 'elevator1',
      width: 10,
      height: 100,
      closeTransform: [[0,1,250],[-1,0,195],[0,0,1]],
      openTransform: [[0,1,200],[-1,0,195],[0,0,1]],
      passable: false,
      visible: true
    },
     {
      type: Door,
      name: 'elevator2',
      width: 10,
      height: 100,
      closeTransform: [[0,1,350],[-1,0,195],[0,0,1]],
      openTransform: [[0,1,400],[-1,0,195],[0,0,1]],
      passable: false,
      visible: true
    },

    {
      type: Switch,
      width: 60,
      height: 30,
      transform: [[1,0,300],[0,1,110],[0,0,1]],
      onOn: function() {
        var world = this.world;
        setTimeout(world.win.bind(world), 5);
      }
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