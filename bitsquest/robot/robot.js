define([
  'underscore',
  'backbone',
  'base/obj',
  'base/box',

  'robot/components/cannon',
  'robot/components/sensor',
  'robot/components/radar',
  'robot/components/thrusters',
  'robot/engines/javascript/engine'
], function (
  _,
  Backbone,
  Obj,
  Box,

  Cannon,
  Sensor,
  Radar,
  Thrusters,

  Engine
) {
  "use strict";

  var image = new Image();
  image.src = "images/robot.png";


  var Components = Backbone.Collection.extend({
    initialize: function() {
      this.inputEvents = {},
      this.outputEvents = {}
    },
    model: function(attrs, options) {
      return new attrs.type(_.omit(attrs, 'type'));
    }
  });

  var Robot = Backbone.Model.extend(_.defaults({
    xPos: 100,
    yPos: 100,

    friction: 1,
    velocityX: 0,
    velocityY: 0,

    mass: 0,

    started: false,
    color: '#f04040',

    constructor: function Robot() {
      Obj.apply(this, arguments);
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.name = this.name === undefined ? 'robot' : this.name;
      this.width = 0;
      this.height = 0;
      this.invisible = false;
      this.passable = true;
      this.moveable = true;
      this.tickCount = 0;


      this.addChild(new Box({name: 'body', width: 20, height: 20, invisible: false, passable: false }));

      var components = this.components = new Components();
      components.on('add', function(component) {
        var
          inputs = components.inputEvents,
          outputs = components.outputEvents;

        component.bindEvents(this);

        _.forEach(component.inputEvents, function(event) {
          inputs[event] = (inputs[event]|0) + 1;
        });
        _.forEach(component.outputEvents, function(event) {
          outputs[event] = (outputs[event]|0) + 1;
        });
      }.bind(this));

      components.add({type: Thrusters, robot: this});
      components.add({type: Radar, robot: this});
      components.add({type: Cannon, robot: this});
      components.add({type: Sensor, robot: this, transform: [[1,0,0], [0,1,17.5], [0,0,1]], name: 'bottom'});
      components.add({type: Sensor, robot: this, transform: [[-1,0,0], [0,-1,-17.5], [0,0,1]], name: 'top'});
      components.add({type: Sensor, robot: this, transform: [[0,1,17.5], [-1,0,0], [0,0,1]], name: 'right'});
      components.add({type: Sensor, robot: this, transform: [[0,-1,-17.5], [1,0,0], [0,0,1]], name: 'left'});

//      this._registerComponents();

      this._setupEngine();


      this.world.on('world:tick', this.tick.bind(this));
      this.world.on('world:stop', this.stop.bind(this));
      this.world.on('world:start', this.start.bind(this));

      this.on('robot:accelerate', this.setVelocity.bind(this));
      this.on('console:log', this.world.trigger.bind(this.world, 'console:log'));

      this.darkColor = '#' + _.map([0xFF0000, 0x00FF00, 0x0000FF], function(color, part, i) {
          return ((color & part) >> (17 - (i * 8))).toString(16);
        }.bind(this, parseInt(this.color.substring(1), 16))).join('');
    },
    initialize: function() {

    },
    _setupEngine: function() {
      var
        engine = this.engine = new Engine({code: this.code}),
        components = this.components;

      var inputEvents = {
        'console:log': true
      };
      engine.on('all', function(event) {
        if (components.inputEvents[event] || inputEvents[event]) {
          this.trigger.apply(this, arguments);
        }
      }.bind(this));

      var outputEvents = {
        'robot:start': true,
        'robot:stop': true
      };
      this.on('all', function(event) {
        if (components.outputEvents[event] || outputEvents[event]) {
          this.notify.apply(this, arguments);
        }
      }.bind(engine));
    },

    _registerComponents: function () {
      var
        components = this.components,
        componentList = [
          {type: 'robot/components/thrusters'},
          {type: 'robot/components/radar'},
          {type: 'robot/components/cannon'},
          {type: 'robot/components/sensor', transform: [[1,0,0], [0,1,17.5], [0,0,1]], name: 'bottom'},
          {type: 'robot/components/sensor', transform: [[-1,0,0], [0,-1,-17.5], [0,0,1]], name: 'top'},
          {type: 'robot/components/sensor', transform: [[0,1,17.5], [-1,0,0], [0,0,1]], name: 'right'},
          {type: 'robot/components/sensor', transform: [[0,-1,-17.5], [1,0,0], [0,0,1]], name: 'left'}],
        robot = this;

      _.forEach(componentList, function(component) {
        require([component.type], function(type) {
          components.add(_.extend({robot: robot, type: type}, _.omit(component, 'type')));
        });
      });

    },

    setVelocity: function(x, y) {
      this.velocityX = x;
      this.velocityY = y;
    },

    accelerate: function(x, y) {
      var
        vX = this.velocityX + x,
        vY = this.velocityY + y,
        v2 = vX * vX + vY * vY,
        v = Math.sqrt(v2),
        vF = v - 0.8 - (v2 / 100);

      if (vF > 0) {
        vF = vF / v;
        vX *= vF;
        vY *= vF;
      } else {
        vX = 0;
        vY = 0;
      }

      this.velocityX = vX;
      this.velocityY = vY;

    },
    visit: function(visitor) {
      var skip = visitor.visit.call(visitor, this);
      if (skip) {
        return;
      }
      if (this.children) {
        var children = this.children;
        for (var i = 0; i < this.children.length; i++) {
          children[i].visit(visitor);
        }
      }
    },
    illuminate: function(world) {
      world.drawLighting(this.realX, this.realY - 2, this.darkColor, {ignore: [this]});

      this.components.forEach(function(component) {
        if (component.illuminate) {
          component.illuminate(world);
        }
      });
    },
    setCode: function(code) {
      this.engine.set('code', code);
      this.code = code;
    },

    hit: function(object) {
      console.log(this.name + ' hit by ' + object.name);
    },
    start: function() {
      this.started = true;
      this.trigger('robot:start', true);
    },

    stop: function() {
      this.started = false;
      this.trigger('robot:stop', true);
    },
    tick: function() {
      this.tickCount++;

      if (!this.started) {
        return;
      }
      this.trigger('robot:tick', this);
      if (this.velocityX || this.velocityY) {
        this.move(this.xPos + this.velocityX, this.yPos + this.velocityY);
      }


    },
    move: function(x, y) {
      this.xPos = x;
      this.yPos = y;
      this.trigger('robot:moving', {x: x, y: y});
      Obj.prototype.move.call(this, x, y);

    },
    draw: function(context) {
      context.drawImage(image, -image.width / 2, -image.height / 2);

      this.components.forEach(function(component) {
        component.draw(context);
      });

      var overlay = this.world.contexts.overlay;
      overlay.beginPath();
      overlay.strokeStyle = '#d0d0d0';
      overlay.fillStyle = '#d0d0d0';
      overlay.lineWidth = 1;
      overlay.arc(this.realX, this.realY - 2, 6, 0, Math.PI * 2);

      overlay.fill();
      overlay.stroke();

      overlay.beginPath();
      overlay.strokeStyle = this.darkColor;
      overlay.lineWidth = 3;
      overlay.fillStyle = '#e0e0e0';
      overlay.arc(this.realX, this.realY - 2, 4, 0, Math.PI * 2);
      overlay.fill();
      overlay.stroke();

      var offset = this.tickCount / 10;
      overlay.beginPath();
      overlay.strokeStyle = this.color;
      overlay.lineWidth = 3;
      overlay.arc(this.realX, this.realY - 2, 4, offset, offset + 2);
      overlay.stroke();
    }
  }, Obj.prototype));


  return Robot;
});