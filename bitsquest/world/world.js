define([
  'jquery',
  'underscore',
  'backbone',
  'base/obj',
  'base/box'
], function (
  $,
  _,
  Backbone,
  Obj,
  Box
) {
  "use strict";

  var intersect = function(a, b, extendB) {
    var x1 = a.p1.x, x2 = a.p2.x, x3 = b.p1.x, x4 = b.p2.x;
    var y1 = a.p1.y, y2 = a.p2.y, y3 = b.p1.y, y4 = b.p2.y;
    var denom =  ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
    if ((ua >= -0.000000001 && ua <= 1.00000001) && ((ub >= -0.000000001 && ub <= 1.00000001) || (ub > 0 && extendB))) {
      var s = ua;
      var intersection = {x: x1 + s * (x2 - x1), y: y1 + s * (y2 - y1)};
      var d = Math.pow(intersection.x - b.p1.x, 2) + Math.pow(intersection.y - b.p1.y, 2);
      return { i: intersection, d: d };
    }
    return undefined;
  };


  var World = Backbone.View.extend({
    _createCanvas: function(width, height, id, className) {
      var parentElement = this.el;

      var canvas = document.getElementById(id);
      if (canvas) {
        return canvas;
      }

      canvas = document.createElement('canvas');
      canvas.className = className;
      canvas.width=width;
      canvas.height=height;
      canvas.id = id;

      parentElement.appendChild(canvas);

      return canvas;
    },

    constructor: function World() {
      Backbone.View.prototype.constructor.apply(this, arguments);
    },

    initialize: function(values) {

      this.contexts = {
        background: this._createCanvas(600, 600, 'background-canvas', 'game_canvas').getContext('2d'),
        world: this._createCanvas(600, 600, 'world-canvas', 'game_canvas').getContext('2d'),
        overlay: this._createCanvas(600, 600, 'overlay-canvas', 'game_canvas').getContext('2d'),
        shadow: this._createCanvas(600, 600, 'shadow-canvas', 'shadow_canvas hidden').getContext('2d')
      };


      this.contexts.world.setTransform(1, 0, 0, 1, 0.5, 0.5);
      this.contexts.shadow.setTransform(1, 0, 0, 1, 0.5, 0.5);
      this.contexts.overlay.setTransform(1, 0, 0, 1, 0.5, 0.5);
      this.contexts.shadow.setTransform(1, 0, 0, 1, 0.5, 0.5);

      var i, obj;

      var level = this.level = values.level;

      this.objects = new Box();

      this.tickCount = 0;

      this.moveable = [];
      this.particles = [];
      this.objectMap = {};

      for (i = 0; i < level.walls.length; i++) {
        var wall = level.walls[i];
        this.createWall(wall[0], wall[1], wall[2], wall[3]);
      }

      if (level.objects) {
        for (i = 0; i < level.objects.length; i++) {
          var objdef = level.objects[i];
          obj = new objdef.type(_.extend({world: this}, _.omit(objdef, 'type')));
          this.addObject(obj);
        }
      }

      if (level.init) {
        level.init(this);
      }

      this._renderBackground(this.contexts.background);

      this.tick = this.tick.bind(this);

    },

    removeObject: function(obj) {
      var i = 0;
      if (obj.name) {
        delete this.objectMap[obj.name];
      }
      if (obj.moveable) {
        i = this.moveable.length - 1;
        while (i >= 0) {
          if (this.moveable[i].id === obj.id) {
            this.moveable.splice(i, 1);
            break;
          }
          i--;
        }
      }
      if (obj.interactive) {
        this.objects.removeChild(obj);
      }
    },

    addObject: function(obj) {
      if (obj.name) {
        this.objectMap[obj.name] = obj;
      }
      if (obj.interactive) {
        this.objects.addChild(obj);
      }
      if (obj.moveable) {
        this.moveable.push(obj);
      }
    },
    deconstructVisibleBoxes: function(ignore) {
      var ignoreIds = {};

      _.forEach(ignore, function(object) {
        ignoreIds[object.id] = true;
      });


      var visitor = {
        segments: [],
        visit: function(box) {
          if (ignoreIds[box.id]) {
            return true;
          }
          if (!box.invisible && !box.passable) {
            // concat is probably expensive.
            this.segments = this.segments.concat(box.decompose());
          }
        }
      };
      this.objects.visit(visitor);
      return visitor.segments;
    },

    /**
     * Filters the segments to only those "facing" the supplied point and returns
     * a list of endpoints
     * @param x
     * @param y
     * @param allSegments
     * @returns {Array}
     * @private
     */
    getRelevantPoints: function(x,y, allSegments, options) {
      var dot = function(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
      };

      var ignoreIds = {};
      _.forEach(options.ignore || [], function(box) {
        box.visit({ visit: function (box) {
          if (box.id) {
            ignoreIds[box.id] = true;
          }
        }});
      });

      var i;
      var points = [];
      var segments = [];
      var segmentId = 0;
      var angle = 0;
      for (i = 0; i < allSegments.length; i++) {
        var segment = allSegments[i];

        if (segment.box && segment.box.id && ignoreIds[segment.box.id]) {
          continue;
        }


        var dotValue  = dot({ x: segment.midpoint.x - x, y: segment.midpoint.y - y}, segment.normal);

        if (dotValue < 0) {
          segments.push(segment);
          segmentId ++;
          var p1 = { p: segment.p1, s: segment, id: segmentId, dot: dotValue };
          var p2 = { p: segment.p2, s: segment, id: segmentId, dot: dotValue };

          p1.angle = Math.atan2(p1.p.y - y, p1.p.x - x);
          p2.angle = Math.atan2(p2.p.y - y, p2.p.x - x);

          var dAngle = p2.angle - p1.angle;
          if (dAngle <= -Math.PI) { dAngle += 2*Math.PI; }
          if (dAngle > Math.PI) { dAngle -= 2*Math.PI; }
          p1.begin = (dAngle > 0.0);
          p2.begin = !p1.begin;

          points.push(p1);
          points.push(p2);
        }
      }

      points.sort(function(p1, p2) {
        var result = p1.angle - p2.angle;
        if (result === 0)  {
          if (p1.begin !== p2.begin) {
            result = p1.begin ? -1 : 1;
          } else {
            return 0;
          }
        }
        return result;
      });

      return points;
    },

    createObj: function(fromX, fromY, toX, toY, properties) {
      var x1, x2, y1, y2;

      if (fromX > toX) {
        x1 = toX;
        x2 = fromX;
      } else {
        x1 = fromX;
        x2 = toX;
      }
      if (fromY > toY) {
        y1 = toY;
        y2 = fromY;
      } else {
        y1 = fromY;
        y2 = toY;
      }

      var width = x2 - x1;
      var height = y2 - y1;

      var obj = new Obj({ width: width, height: height, world: this });
      obj = _.extend(obj, properties);
      obj.transform = obj.translate(x1 + width / 2, y1 + height / 2);
      obj._update();

      return obj;
    },

    lose: function(reason) {
      this.trigger('world:lose', reason);
    },

    win: function(reason) {
      this.trigger('world:win', reason);
    },

    findObject: function(name) {
      return this.objectMap[name];
    },

    _drawWall: function(context) {
      var hwidth = this.width / 2;
      var hheight = this.height / 2;
      context.save();
      context.beginPath();
      context.fillStyle = '#205081';
      context.strokeStyle = '#205081';
      context.rect(-hwidth, -hheight, this.width, this.height);
      context.stroke();
      context.fill();
      context.restore();

    },
    createWall: function(fromX, fromY, toX, toY) {
      var wall = this.createObj(fromX, fromY, toX, toY, { passable: false, invisible: false });
      wall.draw = this._drawWall;
      this.objects.addChild(wall);
    },

    _renderBackground: function(context) {
      var
        bgColor = '#a0a0ff',
        majorColor = '#f6f7f9',
        minorColor = '#a4b3c2';

      var i;

      context.fillStyle = bgColor;
      context.fillRect(0,0,600,600);

      for (i = 1; i < 60; i++) {
        context.beginPath();
        if (i % 10 === 0) {
          context.strokeStyle = majorColor;
        } else {
          context.strokeStyle = minorColor;
        }
        context.moveTo(0, i * 10 - 1);
        context.lineTo(600, i * 10 - 1);
        context.moveTo(i * 10 - 1, 0);
        context.lineTo(i * 10 - 1, 600);
        context.stroke();
      }
    },
    nearest: function(ray, ignore) {
      var i;

      var segments = this.deconstructVisibleBoxes(ignore);
      var nearest;
      for (i = 0; i < segments.length; i++) {
        var segment = segments[i];
        var inter = intersect(segment, ray, true);
        if (inter) {
          if (!nearest) {
            nearest = inter;
          } else {
            if (nearest.d > inter.d) {
              nearest = inter;
            }
          }
        }
      }
      return nearest;
    },

    renderParticles: function(context) {
      var particles = this.particles;
      for (var i = 0; i < particles.length; i++) {
        this.particles[i].render(context);
      }
    },
    render: function() {
      var overlayContext = this.contexts.overlay;
      var context = this.contexts.world;
      overlayContext.clearRect(0,0,600,600);
      context.clearRect(0,0,600,600);
      this.objects.render(context);
      this.renderParticles(context);
    },

    addParticle: function(particle) {
      this.particles.push(particle);
    },

    removeParticle: function(particle) {
      var particles = this.particles;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (p.id === particle.id) {
          particles.splice(i, 1);
          this.particles = particles;
          break;
        }
      }
    },

    tick:  function() {
      var m, i, j, p;

      this.trigger('world:tick', this);

      for (m = 0; m < this.moveable.length; m++) {
        var moveable = this.moveable[m];

        var objects = this.objects.intersects(moveable);
        for (i = 0; i < objects.length; i++) {
          var object = objects[i];


          var parts = moveable.intersects(object);
          for (j = 0; j < parts.length; j++) {
            var part = parts[j];
            if (part.onContact) {
              part.onContact(object, moveable);
            }
          }
          if (object.onContact) {
            object.onContact(moveable, this);
          }
          if (object.onCovered && moveable.overlays(object)) {
            object.onCovered(moveable, this);
          }

        }
      }

      var particles = this.particles;
      i = particles.length - 1;
      while (i >= 0) {
        this.particles[i].tick(this);
        i--;
      }

    },

    start: function() {
      this.trigger('world:start');
    },

    stop: function() {
      this.trigger('world:stop');
    }
  });


  return World;
});