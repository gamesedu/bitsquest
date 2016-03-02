define([
  'underscore',
  'base/obj'
], function (
  _,
  Obj
) {
   "use strict";

    var Goal = function() {
      Obj.apply(this, arguments);
    };

    Goal.prototype = _.defaults({
      onCovered: function(what, world) {
        if (what.name === 'player') {
          world.win();
        }
      },
      passable: true,
      invisible: true
    }, Obj.prototype);

  return Goal;
});