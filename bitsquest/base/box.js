define([
  'underscore',
  'base/shape'
], function (
  _,
  Shape
) {

  var Box = function() {
    this.init.apply(this, arguments);
  };
  Box.prototype = _.defaults({
    realTransform: null,

    realX: 0,
    realY: 0,

    width: 0,
    height: 0,

    boundWidth: 0,
    boundHeight: 0,

    children: null,
    passable: true,
    invisible: true,


    _calculateRealTransform: function() {
      if (this.parentBox) {
        var p = this.parentBox.realTransform;
        var t = this.transform;

        this.realTransform = this._multiplyTransforms(p, t);
      } else {
        this.realTransform = this.transform;
      }
    },

    intersects: function(box, passable) {
      var list = [];
      if (this.id == box.id) {
        return list;
      }
      if ((Math.abs(this.realX - box.realX) << 1 <= (this.boundWidth + box.boundWidth))
          && (Math.abs(this.realY - box.realY) << 1 <= (this.boundHeight + box.boundHeight))) {
            if (this.children) {
              for (var i = this.children.length; i > 0; i--) {
                var result = this.children[i - 1].intersects(box, passable);
                if (result.length > 0) {
                  list = list.concat(result);
                }
              }
            }
            if (list.length == 0 && ((passable === undefined) || this.passable === passable)) {
              list.push(this);
            }
            return list;
          }
          return [];
    },
    overlays: function(box) {
      var diffX = Math.abs(this.width - box.width) / 2 + 5;
      var diffY = Math.abs(this.height - box.height) / 2  + 5;
      return ((Math.abs(box.realX - this.realX) <= diffX)
              && (Math.abs(box.realY - this.realY) <= diffY));
    },
    draw: function(context) {

    },
    visit: function(visitor) {
      var skip = visitor.visit.call(visitor, this);
      if (skip) {
        return;
      }
      if (this.children && !skip) {
        var children = this.children;
        for (var i = 0; i < this.children.length; i++) {
          children[i].visit(visitor);
        }
      }
    },
    render: function(context) {
      if (! this.invisible) {
        context.save();
        context.transform(this.realTransform[0][0], this.realTransform[0][1], this.realTransform[1][0], this.realTransform[1][1], this.realTransform[0][2], this.realTransform[1][2]);
        this.draw(context);
        context.restore();
      }

      if (this.children) {
        for (var i = this.children.length; i > 0; i--) {
          this.children[i - 1].render(context);
        }
      }
    },

    _Segment: function(p1, p2, box) {
      var x1 = p1.x, x2 = p2.x, y1 = p1.y, y2 = p2.y;
      var dx = x2 - x1;
      var dy = y2 - y1;

      var dx2 = dx * dx;
      var dy2 = dy * dy;
      var m = Math.sqrt(dx2 + dy2);

      var midpoint = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      var normal = { x: -dy / m *  5, y: dx / m * 5 };

      this.p1 = p1;
      this.p2 = p2;
      this.normal = normal;
      this.midpoint = midpoint;
      this.M = m;
      this.dx = dx;
      this.dy = dy;

      this.box = box;
    },

    decompose: function() {
      // TODO: Technically I should apply the transform to the four corners.
      var hwidth = this.boundWidth / 2;
      var hheight = this.boundHeight / 2;
      var x = this.realX;
      var y = this.realY;
      var point1 = ({ x: x - hwidth, y: y - hheight, box: this});
      var point2 = ({ x: x - hwidth, y: y + hheight, box: this});
      var point3 = ({ x: x + hwidth, y: y + hheight, box: this});
      var point4 = ({ x: x + hwidth, y: y - hheight, box: this});

      var segment1 = new this._Segment(point1, point2, this);
      var segment2 = new this._Segment(point2, point3, this);
      var segment3 = new this._Segment(point3, point4, this);
      var segment4 = new this._Segment(point4, point1, this);

      return [segment1, segment2, segment3, segment4];
    },


    findParent: function(name) {
      if (this.name === name) {
        return this;
      }
      if (this.parentBox) {
        return parentBox.findParent(name);
      }
      return undefined;
    },

    removeChild: function(box) {
      if (this.children) {
        var i = 0;
        var children = this.children;

        while (i < children.length) {
          if (children[i].id === box.id) {
            children.splice(i, 1);
            break;
          }
          i++;
        }
      }
    },

    addChild: function(box) {
      if (!this.children) {
        this.children = [box];
      } else {
        this.children.push(box);
      }

      box.parentBox = this;
      this._update();
    },

    _update: function() {
      this._calculateRealTransform();

      var relative = this._applyTransform(this.realTransform, 0, 0);

      this._updateChildBoxes();

      this.realX = relative[0];
      this.realY = relative[1];

      var bounds1 = this._applyTransform(this.realTransform, 0, this.height);
      var bounds2 = this._applyTransform(this.realTransform, this.width, 0);

      this.boundWidth = Math.max(Math.abs(bounds1[0] - relative[0]), Math.abs(bounds2[0] - relative[0]));
      this.boundHeight = Math.max(Math.abs(bounds1[1] - relative[1]), Math.abs(bounds2[1] - relative[1]));

      var hheight = this.height / 2;
      var hwidth = this.width / 2;

      this.hHeight = hheight;
      this.hWidth = hwidth;

      return [
        this._applyTransform(this.transform, 0 - hwidth, 0 - hheight),
        this._applyTransform(this.transform, 0 + hwidth, 0 + hheight) ];
    },

    _updateChildBoxes: function() {
      if (this.children) {
        var height = this.height / 2;
        var width = this.width / 2;

        for (var i = this.children.length; i > 0; i--) {
          var rect = this.children[i - 1]._update();
          width = Math.max(width, Math.abs(rect[0][0]), Math.abs(rect[1][0]));
          height = Math.max(height, Math.abs(rect[0][1]), Math.abs(rect[1][1]));
        }
        this.height = height * 2;
        this.width = width * 2;
      }
    }
  }, Shape.prototype);

  return Box;
});