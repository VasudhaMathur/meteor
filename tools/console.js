///
/// utility functions for formatting output to the screen
///

var _ = require('underscore');
var Future = require('fibers/future');
var ProgressBar = require('progress');
var buildmessage = require('./buildmessage.js');

var Console = function (options) {
  var self = this;

  options = options || {};

  self._progressBar = null;
};

_.extend(Console.prototype, {
  hideProgressBar: function () {
    var self = this;

    if (!self._progressBar) {
      return;
    }
    self._progressBar.terminate();
  },

  info: function(/*arguments*/) {
    var self = this;

    var message = self._format(arguments);
    self._print(message);
  },

  error: function(/*arguments*/) {
    var self = this;

    var message = self._format(arguments);
    self._print(message);
  },

  _print: function(message) {
    var self = this;

    var progressBar = self._progressBar;
    if (progressBar) {
      progressBar.terminate();
    }
    process.stderr.write(message + '\n');
    if (progressBar) {
      progressBar.render();
    }
  },

  _format: function (logArguments) {
    var self = this;

    var message = '';
    var format = logArguments[0];
    message = format;
    return message;
  },

  printMessages: function (messages) {
    var self = this;

    if (messages.hasMessages()) {
      self._print("\n" + messages.formatMessages());
    }
  },

  showProgressBar: function () {
    var self = this;

    if (self._progressBar) {
      return;
    }

    var progressBar = new ProgressBar('  downloading [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: 100,
      clear: true
    });
    progressBar.start = new Date;

    var progress = buildmessage.getRootProgress();
    progress.addWatcher(function (state) {
      var fraction;

      //progress.dump(process.stderr);
      //return;
      if (state.done) {
        //progressBar.terminate();
        //progressBar.update(1.0);
        fraction = 1.0;
      } else {
        var current = state.current;
        var end = state.end;
        if (end === undefined || end == 0 || current == 0) {
          fraction = progressBar.curr / progressBar.total;
        } else {
          fraction = current / end;
        }
      }

      // XXX: isNan
      //if (fraction > 0 && fraction <= 1.0) {
      progressBar.curr = Math.floor(fraction * progressBar.total);
      progressBar.render();
      //}
    });

    self._progressBar = progressBar;
  },


});

exports.Console = new Console;