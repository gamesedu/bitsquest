define([
  'underscore',
  'backbone'
], function (
  _,
  Backbone
) {
  "use strict";

  return Backbone.Model.extend({
    constructor: function JavascriptEngine() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    initialize: function() {
      var worker = new Worker('robot/engines/javascript/worker.js');
      worker.onmessage = function(message) {
        this.trigger.apply(this, message.data);
      }.bind(this);

      this.worker = worker;

      if (this.get('code')) {
        this.worker.postMessage(['engine:program', this.get('code')]);
      }
      this.on('change:code', function(engine, code) {
        engine.worker.postMessage(['engine:program', code]);
      });
    },
    notify: function() {
      this.worker.postMessage([].slice.call(arguments, 0));
    }
  });
});