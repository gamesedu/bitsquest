define([
  'underscore',
  'robot/component',
  'objects/surface'
], function (
  _,
  Component,
  Surface
) {
  "use strict";


  var Sensor = Component.extend(_.defaults({
    constructor: function Sensor() {
       Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function() {
      this.touching = false;
      this.touched = false;

      this.name = this.get('name');
      this.transform = this.get('transform');
      this.parent = this.get('robot');
      this.width = 25;
      this.height = 5;
      this.invisible = false;
      this.passable = false;

      Surface.call(this, this.parent, this.transform, this.name);

      var unit = this._applyTransform(this.transform, 0, 1);
      var center = this._applyTransform(this.transform, 0,0 );
      unit[0] -= center[0];
      unit[1] -= center[1];

      this.surfaceVector = unit;
      this.parent.addChild(this);
      if (this.parent.on) {
        this.parent.on('robot:tick', this.tick.bind(this));
      }
      this._update();
      
      this.outputEvents = ['sensor:' + this.name];
    },

    draw: function() {},

    tick: function() {

      if (this.touched !== this.touching) {
        this.touching = this.touched;
        this.parent.trigger('sensor:' + this.name, false);
      }
      if (this.touched) {
        this.touched = false;
      }
    }
  }, Surface.prototype));

  return Sensor;

});