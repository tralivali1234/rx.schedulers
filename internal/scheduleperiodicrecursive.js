'use strict';

var SingleAssignmentDisposable = require('rx.disposables').SingleAssignmentDisposable;
var tryCatchUtils = require('./trycatchutils');
var tryCatch = tryCatchUtils.tryCatch, thrower = tryCatchUtils.thrower;

function createTick(self) {
  return function tick(command, recurse) {
    recurse(0, self._period);
    var state = tryCatch(self._action)(self._state);
    if (state === global.RxSchedulers.errorObj) {
      self._cancel.dispose();
      thrower(state.e);
    }
    self._state = state;
  };
}

function SchedulePeriodicRecursive(scheduler, state, period, action) {
  this._scheduler = scheduler;
  this._state = state;
  this._period = period;
  this._action = action;
}

SchedulePeriodicRecursive.prototype.start = function () {
  var d = new SingleAssignmentDisposable();
  this._cancel = d;
  d.setDisposable(this._scheduler.scheduleRecursiveFuture(0, this._period, createTick(this)));

  return d;
};

module.exports = SchedulePeriodicRecursive;
