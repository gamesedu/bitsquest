define([
  'underscore',
  'backbone'
], function (
  _,
  Backbone
) {
  "use strict";

  function eventForwarder() {
    this.trigger.apply(this, arguments);
  }
  var Component = Backbone.Model.extend({
    inputEvents: undefined,
    outputEvents: undefined,

    bindEvents: function(bus) {
      _.forEach(this.inputEvents, function(event) {
          bus.on(event, eventForwarder.bind(this, event));
      }.bind(this));

      _.forEach(this.outputEvents, function(event) {
          this.on(event, eventForwarder.bind(bus, event));
      }.bind(this));
    }
  });

  return Component;
});