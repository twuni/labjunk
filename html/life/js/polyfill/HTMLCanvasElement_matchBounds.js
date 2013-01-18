HTMLCanvasElement.prototype.matchBounds = function() {
  var bounds = this.getBoundingClientRect();
  this.width = bounds.width;
  this.height = bounds.height;
};
