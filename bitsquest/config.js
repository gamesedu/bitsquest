require.config({
  baseUrl: '',
  paths: {
    jquery: 'lib/jquery-2.0.2.min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});