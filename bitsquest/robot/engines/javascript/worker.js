importScripts('../../../lib/underscore-min.js', '../../../lib/backbone-min.js');
var _console = console;
var console = {
  log: function() {
    self.postMessage(['console:log',[].slice.call(arguments, 0)]);
  }
};

var context = {
  cannon: {
    _ready: false,
    _angle: 0,
    _listener: function(value) {
      this._ready = value;
    },
    _angleListener: function(value) {
      this._angle = value;
    },
    fire: function() {
      self.postMessage(['cannon:fire']);
    },
    ready: function() {
      return this._ready;
    },
    aim: function(angle) {
      if (angle === undefined) {
        return this._angle;
      } else {
        self.postMessage(['cannon:set-angle', angle]);
      }
    }
  },
  thrusters: {
    state: {},
    fn: function(direction, status) {
      if (status === undefined) {
        return this.state[direction];
      }
      if (status) {
        self.postMessage(['thrusters:start', direction]);
      } else {
        self.postMessage(['thrusters:stop', direction]);
      }
    },
    _listener: function(state, thruster) {
      this.state[thruster] = state;
    }

  },
  radar:  {
    currentAngle: 0,

    ping: function() {
      self.postMessage(['radar:fire', this.currentAngle])

    },
    angle: function(angle) {
      if (angle === undefined) {
        return this.currentAngle;
      } else {
        this.currentAngle = angle |0;
      }
    }
  }
};

_.bindAll(context.thrusters, '_listener');
_.bindAll(context.radar, 'ping', 'angle');
_.bindAll(context.cannon, 'ready', 'aim', 'fire', '_listener');

context.thrusters.left = context.thrusters.fn.bind(context.thrusters, 'left');
context.thrusters.right = context.thrusters.fn.bind(context.thrusters, 'right');
context.thrusters.top = context.thrusters.fn.bind(context.thrusters, 'top');
context.thrusters.bottom = context.thrusters.fn.bind(context.thrusters, 'bottom');


_.extend(context, Backbone.Events);

self.onmessage = function(message) {
  var data = message.data;

  if (data[0] === 'engine:program') {
    context.off();

    eval('[function() {' + data[1] + '}]')[0].call(context);

    context.on('thrusters:off', context.thrusters._listener.bind(context.thrusters, false));
    context.on('thrusters:on', context.thrusters._listener.bind(context.thrusters, true));
    context.on('cannon:ready', context.cannon._listener.bind(context.cannon, true));
    context.on('cannon:fired', context.cannon._listener.bind(context.cannon, false));
    context.on('cannon:angle', context.cannon._angleListener.bind(context.cannon));

    context.on('robot:start', function() {
      // compatibility
      context.trigger('start', true);
    });

    context.on('robot:stop', function() {
      context.off();
    });
  } else {
    try {
      context.trigger.apply(context, message.data);
    } catch (e) {
      _console.log(e);
      _console.log(e.stack);
    }

  }
};


