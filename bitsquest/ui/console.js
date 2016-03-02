define([
  'jquery',
  'underscore',
  'backbone'
], function (
  $,
  _,
  Backbone
) {
  "use strict";

  var Console = Backbone.View.extend({
    time: 0,
    formatError: _.template('<div><div><%= time %></div><div class="error"><%=name%>: <%= message %></div></div>'),
    format: _.template('<div><div><%= time %></div><div><%= message %></div></div>'),
    entries: [],
    dirty: false,

    clear: function() {
      this.entries = [];
      this.display();
    },

    log: function(what) {
      var entries = this.entries;
      while (entries.length > 100) {
        entries.shift();
      }
      if (what instanceof Error) {
        entries.push(this.formatError({ time: this.time, name: what.name, message: what.message }));
      } else {
        entries.push(this.format({ time: this.time, message: what }));
      }

      if (! this.dirty) {
        setTimeout(this.display.bind(this), 100);
        this.dirty = true;
      }
    },
    setTime: function(time) {
      this.time = time;
    },
    display: function() {
      if (!this.dirty) {
        return;
      }

      var
        entries = this.entries,
        html = [],
        element = this.el;

      for (var i = 0; i < entries.length; i++) {
        html.push(entries[i]);
      }

      element.innerHTML = html.join('');
      element.scrollTop = element.scrollHeight;
      this.dirty = false;
    }
  });

  return Console;
});