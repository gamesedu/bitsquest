define([
  'underscore',
  'backbone',
  'base/box',
  'world/world'
], function (
  _,
  Backbone,
  Box,
  World
) {
  "use strict";

  var distance = function(p1, p2) {
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
  };

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




  var LitWorld = World.extend({
    constructor: function LitWorld() {
      World.prototype.constructor.apply(this, arguments);
    },
    initialize: function() {
      this.lights = new Box();

      World.prototype.initialize.apply(this, arguments);


      this.lighting = true;
      this.darkness = 0.50;

      // TODO: Create these programmatically
      this.workarea = document.getElementById('work_area').getContext('2d');
      this.gradient = document.getElementById('gradient').getContext('2d');
      this.gradient.clearRect(0,0,310,310);

      var g = this.gradient.createRadialGradient(155, 155, 0, 155, 155, 155);
      g.addColorStop(0,   'rgba(0,0,0,0)'); // 100%
      g.addColorStop(0.05,   'rgba(0,0,0,0)'); // 80%
      g.addColorStop(0.1,   'rgba(0,0,0,0)'); // 50%
      g.addColorStop(0.180, 'rgba(0,0,0,0.20)'); // 25%
      g.addColorStop(0.250, 'rgba(0,0,0,0.23)'); // 15%
      g.addColorStop(0.400, 'rgba(0,0,0,0.50)'); // 10%
      g.addColorStop(0.600,   'rgba(0,0,0,0.750)'); // 6%
      g.addColorStop(1,   'rgba(0,0,0,1)'); // 1%
      this.gradient.setTransform(1, 0, 0, 1, 0.5, 0.5);
      this.gradient.fillStyle = g;
      this.gradient.fillRect(0,0, 310, 310);
    },
    _illuminate: function(obj) {
      if (obj.illuminate) {
        obj.illuminate(this);
      }
    },

    _renderLighting: function(context, shadowContext) {
      var i;
      if (this.lighting) {

        this.lights.visit({ visit: this._illuminate.bind(this) });
        // doin it, doin it, and doin it manually
        var imageData = context.getImageData(0,0,599,599);
        var data1 = imageData.data;
        var data2 = shadowContext.getImageData(0,0,599,599).data;

        for (i = 0; i < data1.length; i++) {
          data1[i] = (data1[i] * data2[i]) >> 8;
        }
        context.putImageData(imageData, 0, 0);
      }
    },
    addObject: function(obj) {
      World.prototype.addObject.call(this, obj);

      if (obj.illuminate) {
        this.lights.addChild(obj);
      }
    },


    calculateLight: function(x, y, options) {
      var triangles = [];
      var allSegments = this.visibleSegments;

      var i,j,k;

      var points = this.getRelevantPoints(x,y, allSegments, options);
      var open = [];
      var angle;
      var nearest;
      var next;

      for (k = 0; k < 2; k++)  {
        for (i = 0; i < points.length; i++) {
          var currentPoint = points[i];
          var ray = { p1: { x: x, y: y}, p2: { x: currentPoint.p.x, y: currentPoint.p.y}};

          var current_old = open.length > 0 ? open[0] : null;
          var start;
          var inter;

          if (currentPoint.begin) {
            // handle open
            start = { i: currentPoint.p, d: distance(currentPoint.p, ray.p1)};

            currentPoint.inter = start;

            nearest = undefined;
            next = undefined;

            // find the insertion point for this opening by scanning for the
            // next closest opening
            for (j = 0; j < open.length; j++) {
              next = open[j];
              inter = intersect(next.s, ray, true);

              if (start.d < inter.d) {
                next.inter = inter;
                nearest = next;
                break;
              }

              // break a tie by selecting the closest line
              if (start.d === inter.d) {
                var dmp1 = Math.pow(currentPoint.s.midpoint.x - x, 2) + Math.pow(currentPoint.s.midpoint.y - y, 2);
                var dmp2 = Math.pow(next.s.midpoint.x - x, 2) + Math.pow(next.s.midpoint.y - y, 2);
                if (dmp2 > dmp1) {
                  next.inter = inter;
                  nearest = next;
                  break;
                }
              }
            }
            // if currentPoint is not obscuring another segment, push it onto
            // stack otherwise insert it before the obscured open point.
            if (! nearest) {
              open.push(currentPoint);
            } else {
              open.splice(j, 0, currentPoint);
            }
          } else {
            for (j = 0; j < open.length; j++) {
              if (open[j].id === currentPoint.id) {
                break;
              }
            }
            if (j < open.length) {
              // Copy endpoint intersection to begin object for rendering
              var removed = open.splice(j, 1)[0];
              //what did I uncover?
              start = intersect(currentPoint.s, ray);
              removed.inter = start;

              if (j === 0) {
                next = open[0];
                if (next) {
                  inter = intersect(next.s, ray, true);
                  next.inter = inter;
                  next.start = inter;
                }
              }
            }
          }

          if (open.length > 0 && open[0].start === undefined) {
            open[0].start = open[0].inter;
          }

          var current_new = open.length > 0 ? open[0] : null;

          if (current_old != current_new) {
            if (current_old != null && current_old.start) {
              if (k === 1) {
                triangles.push({
                  p1: { x: x, y: y },
                  p2: { x: current_old.start.i.x, y: current_old.start.i.y },
                  p3: { x: current_old.inter.i.x, y: current_old.inter.i.y }
                });
              }
              current_old.start = undefined;
            }
          }
          angle = currentPoint.angle;
        }
      }
      return triangles;
    },

    drawLighting: function(realX, realY, color, options) {
      if (!this.lighting) {
        return;
      }
      var i;
      var context = this.workarea;
      context.setTransform(1, 0, 0, 1, 0.5, 0.5);
      context.clearRect(-1,-1,301,301);
      context.fillStyle = color;
      context.strokeStyle = color;

      var triangles = this.calculateLight(realX, realY, options||{});

      for (i = 0; i < triangles.length; i++) {
        var t = triangles[i];
        context.beginPath();
        context.moveTo(t.p1.x - realX + 150, t.p1.y - realY + 150);
        context.lineTo(t.p2.x - realX + 150, t.p2.y - realY + 150);
        context.lineTo(t.p3.x - realX + 150, t.p3.y - realY + 150);
        context.lineTo(t.p1.x - realX + 150, t.p1.y - realY + 150);
        context.fill();
        context.stroke();
      }
      context.save();
      context.globalCompositeOperation = 'destination-out';
      context.drawImage(this.gradient.canvas, -5, -5);
      context.restore();

      var shadowContext = this.contexts.shadow;
      shadowContext.save();
      shadowContext.globalCompositeOperation = 'lighter';
      shadowContext.drawImage(context.canvas, realX - 150, realY - 150);
      shadowContext.restore();
    },

    render: function() {
      var overlayContext = this.contexts.overlay;
      var context = this.contexts.world;
      context.clearRect(0,0,600,600);
      overlayContext.clearRect(0,0,600,600);

      var visibleSegments = this.deconstructVisibleBoxes();
      visibleSegments.push(new Box.prototype._Segment({ x: -80, y: 680 }, { x: -80, y: -80 }, undefined));
      visibleSegments.push(new Box.prototype._Segment({ x: -80, y: -80 }, { x: 680, y: -80 }, undefined));
      visibleSegments.push(new Box.prototype._Segment({ x: 680, y: -80 }, { x: 680, y: 680 }, undefined));
      visibleSegments.push(new Box.prototype._Segment({ x: 680, y: 680 }, { x: -80, y: 680 }, undefined));
      this.visibleSegments = visibleSegments;

      var shadowContext = this.contexts.shadow;
      var d = 255 - ((255 * this.darkness) | 0);

      shadowContext.fillStyle = 'rgb(' + d + ',' + d + ',' + d + ')';

      shadowContext.fillRect(0,0,599,599);
      shadowContext.setTransform(1,0,0,1,0.5,0.5);

      this._renderBackground(context);
      this.objects.render(context);

      this._renderLighting(context, shadowContext);
      this.renderParticles(context);
    },

    setDarkness: function(darkness) {
      this.darkness = darkness;
      this.lighting = darkness > 0.01;
    }
  }, World.prototype);

  return LitWorld;

});