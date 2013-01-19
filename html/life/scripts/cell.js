define( [
  "color"
], function( Color ) {

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

      var neighbors = [];
      for( var i = 0; i < this.neighbors.length; i++ ) {
        if( this.neighbors[i].alive ) {
          neighbors.push( this.neighbors[i] );
        }
      }

      if( this.alive && !this.survival( neighbors.length ) ) {
        this.fate.alive = false;
      } else if( !this.alive && this.birth( neighbors.length ) ) {
        this.fate.alive = true;
      } else {
        this.fate.alive = this.alive;
      }

      if( this.colorBlending !== "monotone" && this.fate.alive ) {
        this.fate.color = new Color( neighbors[0].color.value );
        for( var i = 1; i < neighbors.length; i++ ) {
          this.fate.color = this.fate.color[ this.colorBlending ]( neighbors[i].color );
        }
      }

    },

    applyTransition: function() {
      this.alive = this.fate.alive;
      this.color = this.fate.color;
    }

  };

  return Cell;

} );
