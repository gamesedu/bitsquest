define([
  'underscore'
], function (
  _
) {
 var id = 0;

  var Model = {
    init: function() {
      this.id = id++;
      if (arguments.length > 0) {
        var properties = arguments[arguments.length - 1];
        for (var f in properties) {
          if (! this.hasOwnProperty(f)) {
            this[f] = properties[f];
          }
        }
      }
    }
  };

  return Model;
});