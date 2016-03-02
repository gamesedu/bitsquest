require([
  'jquery',
  'underscore',
  'backbone',
  'world/litworld',
  'ui/console'
], function (
  $,
  _,
  Backbone,
  World,
  Console
) {
  "use strict";

  var TICK_TIMEOUT = 60;
  var RENDER_RATE = 1;

  var Game = function() {

    this.levelList = [
      { name: 'level0' },
      { name: 'level1' },
      { name: 'level2' },
      { name: 'level5' },
      { name: 'level4' },
      { name: 'level3' },
      { name: 'sokoban' },
      { name: 'level6' },
      { name: 'beta-intro' },
      { name: 'level7' },
      { name: 'sensor-maze' },
      { name: 'bit-random' },
      { name: 'radar-maze' },
      { name: 'temple' },
      { name: 'robot-duel' }
    ];

    this.stopped = true;
    this.editor = undefined;
    this.levels = [];
    this.levelNumber = undefined;
    this.page = 'index.html';
    this.tick = this.tick.bind(this);
    this.tickCount = 0;
  };

  Game.prototype = {

    setup: function() {
      $.ajaxSetup({
        cache: false
      });


      var overlay = '<div class="content"></div><div class="opacity_mask"></div>';
      this.$overlay = $(overlay).appendTo($('#overlay_div'));

      $(window).on('hashchange', this.loadLevel.bind(this));


      this.$overlay.delegate('.next', 'click', this.nextLevel.bind(this));
      this.$overlay.delegate('.replay', 'click', this.loadLevel.bind(this));


      this.editor = CodeMirror(document.getElementById('editarea'), {
        value: '',
        mode:  "javascript",
        matchBrackets: true,
        lineNumbers: true
      });


      $('#run_robots_run').on('click', this.onRun.bind(this));
      $('#stop_robots_stop').on('click', this.onStop.bind(this));

      this.loadLevel();

      this.console = new Console({el: document.getElementById('logs') });
    },

    nextLevel: function() {
      this.selectLevel(this.levelNumber + 1);
    },


    selectLevel: function(number) {
      window.location = this.page + '#' + Math.min(number, this.levelList.length - 1);
    },

    getLevelNumber: function() {
      var hash = window.location.hash;
      if (hash[0] == '#') {
        return Math.min(hash.substring(1)|0, this.levelList.length - 1);
      } else {
        return -1;
      }
    },

    resetDefault: function() {
      var editor = this.editor;
      $.ajax({
        url: "levels/" + this.level.name + ".txt",
        success: function( data ) {
          editor.getDoc().setValue(data);
        }
      });
    },

    onRun: function() {
      this.run();
    },


    onStop: function() {
      this.stop();
    },

    run: function() {
      // Stop anything going on in the old world
      this.stop();

      var code = this.editor.getDoc().getValue();

      localStorage.setItem('robot-code-' + this.level.name, code); 

      // reinit level
      this.setupWorld();

      // Ick
      var player = this.world.findObject('player');
      player.setCode(code);

      this.tickCount = 0;
      this.console.time = 0;
      this.console.clear();

      this.stopped = false;

      this.world.start();
      this.tick();
    },

    stop: function() {
      if (!this.stopped) {
        this.stopped = true;
        this.world.stop();
      }
    },

    tick: function() {
      if (this.stopped) {
        return;
      }
      setTimeout(this.tick, TICK_TIMEOUT);

      if (this.console.setTime) {
        this.console.setTime(this.tickCount);
      }

      try {
        this.world.tick();
      } catch (e) {
        this.stopped = true;
        console.log(e.stack);
        console.log(e);
      }

      this.tickCount++;
      if ((this.tickCount % RENDER_RATE) === 0) {
        window.requestAnimationFrame(this.world.render.bind(this.world));
      }
    },


    setEditorContent: function() {
      var code = localStorage.getItem('robot-code-' + this.level.name);
      if (code == undefined) {
        this.resetDefault();
      } else {
        this.editor.getDoc().setValue(code);
      }
    },

    addLevel: function(level) {
      this.levels[level.name] = level;

      // After load?
      if (this.levelNumber !== undefined && level.name === this.levelList[this.levelNumber].name) {
        this.showLevel();
      }
    },

    loadLevel: function() {
      this.stop();
      var number = this.getLevelNumber();

      if (this.levelNumber === undefined) {
        this.levelNumber = 0;
      }

      if (number == -1) {
        this.selectLevel(this.levelNumber);
        return;
      }

      this.levelNumber = number;
      var name = this.levelList[number].name;

      if (this.levels[name] == undefined) {
        var game = this;
        require(['levels/' + name], function(level) {
          game.addLevel(level);
        });
      } else {
        setTimeout(this.showLevel.bind(this), 0);
      }
    },

    setupWorld: function() {
      // reinit level
      var world = new World({el: document.getElementById('world_view'), level: this.level});
      world.on('console:log', this.log.bind(this));
      world.on('world:win', this.win.bind(this));
      world.on('world:lose', this.lose.bind(this));
      this.world = world;
    },

    showLevel: function() {
      var levelName = this.levelList[this.levelNumber].name;
      this.level = this.levels[levelName];

      document.getElementById('levelTitle').innerHTML = '#' + this.levelNumber + ' - ' + this.level.title || levelName;

      this.setEditorContent();

      this.setupWorld();

      try {
        this.world.render();
      } catch (e) {
        console.log(e);
        return;
      }
      this.hideOverlay();
    },

    showOverlay: function(html) {
      $('#overlay_div').children('.content').html(html);
      $('#overlay_div').removeClass('hidden');
    },

    hideOverlay: function() {
      $('#overlay_div').addClass('hidden');
    },

    lose: function() {
      this.stop();
      this.showOverlay('<h2>Oh, man. You suck.</h2><a class="aui-button aui-button-primary aui-style replay">Retry</a>');
    },

    win: function() {
      this.stop();
      this.showOverlay('<h2>Level complete</h2><a class="aui-button aui-style replay">Replay</a> <a class="aui-button aui-button-primary aui-style next">Next level</a>');
    },

    log: function(message) {

      if (this.console) {
        this.console.log(message);
      } else {
        console.log(message);
      }

    }
  };

  var game = new Game();
  $(document).ready(function(){ 
    game.setup();
  });
  window.game = game;
});