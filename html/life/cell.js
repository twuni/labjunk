var Cell = function( alive, colorValue ) {

  this.alive = alive;
  this.color = ( colorValue instanceof Color ) ? colorValue : new Color( colorValue );

  this.fate = {
    alive: this.alive,
    color: this.color
  };

};

Cell.prototype = {
  weight: function() { return this.alive ? 1 : 0; }
};
