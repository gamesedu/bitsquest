define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
  "use strict";

  var ForceField = function() {
    Obj.apply(this, arguments);
    this.invisible = false;
    this.isOn = true;
    this.passable = false;
  };

  ForceField.prototype = _.defaults({
    _jitter: function(points) {
      var result = [];
      for (var i = 0; i < points.length - 1; i++) {
        var start = points[i], end = points[i + 1];
        result.push(start);
        if ((Math.abs(start.x - end.x) > 4) || (Math.abs(start.y - end.y) > 4)) {
          var xmid = (start.x + end.x + Math.random() * 8 - 4) /2;
          var ymid = (start.y + end.y + Math.random() * 8 - 4) /2;
          result.push({ x: xmid, y: ymid });
        }
        result.push(end);
      }
      return result;
    },
    draw: function(context) {
      var x1 = -this.hWidth, x2 = this.hWidth, y1 = -this.hHeight, y2 = this.hHeight;

      context.beginPath();
      if (this.passable) {
        context.strokeStyle = 'rgba(255, 64, 64, 0.2)';
        context.fillStyle = 'rgba(128, 64, 64, 0.2)';
      } else {
        context.strokeStyle = '#802020';
        context.fillStyle = 'rgba(255, 80, 64, 0.6)';
      }
      context.rect(x1, y1, this.width, this.height);
      context.stroke();
      context.fill();

      if (this.isOn) {
        var count = Math.min(this.width / 40, 4);
        x1+=2;
        y1+=2;
        x2-=2;
        y2-=2;
        var points = [ { x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }, { x: x1, y: y2 }, { x: x1, y: y1 }];
        for (var i = 0; i < count; i++) {
          points = this._jitter(points);
        }

        points.sort(function(a, b) {
          return a.x - b.x;
        });

        var overlay;
        if (this.world.lighting) {
          overlay = this.world.contexts.shadow;
          overlay.save();
          overlay.globalCompositeOperation = 'lighter';
        } else {
          overlay = this.world.contexts.overlay;
          overlay.save();
        }

        overlay.beginPath();
        overlay.lineWidth = 1;
        overlay.transform(this.realTransform[0][0], this.realTransform[0][1],
          this.realTransform[1][0], this.realTransform[1][1],
          this.realTransform[0][2], this.realTransform[1][2]);
        overlay.strokeStyle = '#ff0000';
        overlay.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
          overlay.lineTo(points[i].x, points[i].y);
        }
        overlay.stroke();
        overlay.restore();
      }
    },
    onContact: function(what, world) {
      if (what.name === 'player' && this.isOn) {
        world.lose();
      }
    }
  }, Obj.prototype);

  return ForceField;

});