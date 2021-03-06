function ScheduledDisposable(scheduler, disposable) {
  this.scheduler = scheduler;
  this.disposable = disposable;
  this.isDisposed = false;
}

function scheduleItem(s, self) {
  if (!self.isDisposed) {
    self.isDisposed = true;
    self.disposable.dispose();
  }
}

ScheduledDisposable.prototype.dispose = function () {
  this.scheduler.schedule(this, scheduleItem);
};

module.exports = ScheduledDisposable;
