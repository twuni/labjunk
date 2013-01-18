var Cell = function( parameters ) {

  this.alive = parameters.alive || false;
  this.color = ( parameters.color instanceof Color ) ? parameters.color : new Color( parameters.color );
  this.colorBlending = parameters.colorBlending || "average";
  this.survival = parameters.survival;
  this.birth = parameters.birth;

  this.fate = {
    alive: this.alive,
    color: this.color
  };

};

Cell.prototype = {

  weight: function() { return this.alive ? 1 : 0; },

  prepareTransition: function() {

    var cell = this;
    var neighbors = [];
    for( var i = 0; i < cell.neighbors.length; i++ ) {
      if( cell.neighbors[i].alive ) {
        neighbors.push( cell.neighbors[i] );
      }
    }

    if( cell.alive && !cell.survival( neighbors.length ) ) {
      cell.fate.alive = false;
    } else if( !cell.alive && cell.birth( neighbors.length ) ) {
      cell.fate.alive = true;
    } else {
      cell.fate.alive = cell.alive;
    }

    if( cell.colorBlending !== "monotone" && cell.fate.alive ) {
      cell.fate.color = new Color( neighbors[0].color.value );
      for( var i = 1; i < neighbors.length; i++ ) {
        cell.fate.color = cell.fate.color[ cell.colorBlending ]( neighbors[i].color );
      }
    }

  },

  applyTransition: function() {
    var cell = this;
    cell.alive = cell.fate.alive;
    cell.color = cell.fate.color;
  }

};
